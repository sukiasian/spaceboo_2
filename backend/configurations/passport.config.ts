import * as passport from 'passport';
import { PassportStatic } from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { JwtFromRequestFunction, Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import * as express from 'express';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { UserScopes, User } from '../models/user.model';
import { Environment, ErrorMessages, HttpStatus, RedisVariable } from '../types/enums';
import logger from '../loggers/logger';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import AppError from '../utils/AppError';
import UtilFunctions from '../utils/UtilFunctions';
import { redis } from '../Redis';

export class PassportConfig extends Singleton {
    private readonly userDao: UserSequelizeDao = userSequelizeDao;
    private readonly userModel: typeof User = User;
    private readonly passport: PassportStatic = passport;
    private readonly redisClient = redis.client;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;
    private readonly attemptsAllowed = process.env.NODE_ENV === Environment.DEVELOPMENT ? '100' : '7';

    public initializePassport(): express.Handler {
        return this.passport.initialize();
    }

    private assignAvailableAttempts = async (key: string): Promise<AppError | void> => {
        const loginAttemptsValue = await this.redisClient.get(key);

        if (loginAttemptsValue === null) {
            await this.redisClient.set(key, '1');
        } else if (loginAttemptsValue === this.attemptsAllowed) {
            // FIXME: change the value from 0.1 to 60 * 30
            await this.redisClient.setEx(key, 5, this.attemptsAllowed);
        } else {
            await this.redisClient.set(key, `${this.utilFunctions.makeDecimal(loginAttemptsValue) + 1}`);
        }
    };

    private outOfAttempts = async (key: string): Promise<boolean> => {
        const loginAttemptsValue = await this.redisClient.get(key);

        return loginAttemptsValue === this.attemptsAllowed ?? false;
    };

    private handleAttempts = async (ip: string) => {
        const loginAttemptsKey = `${RedisVariable.LOGIN_ATTEMPTS}:${ip}`;

        await this.assignAvailableAttempts(loginAttemptsKey);

        const outOfAttempts = await this.outOfAttempts(loginAttemptsKey);

        if (outOfAttempts) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.WAIT_TO_ATTEMPT_AGAIN);
        }
    };

    private annualizeAttempts = async (ip: string) => {
        await this.redisClient.set(`${RedisVariable.LOGIN_ATTEMPTS}:${ip}`, '0');
    };

    public configurePassport(): void {
        const tokenExtractorFromCookie: JwtFromRequestFunction = (req) => {
            let token: string;

            if (req && req.cookies) {
                token = req.cookies['jwt'];
            }

            return token;
        };

        this.passport.use(
            new LocalStrategy(
                { usernameField: 'email', passwordField: 'password', session: false, passReqToCallback: true },
                async (req, email, password, done) => {
                    try {
                        let user: User;

                        user = await this.userModel.scope(UserScopes.WITH_PASSWORD).findOne({ where: { email } });

                        await this.handleAttempts(req.ip);

                        if (!user || !(await user.verifyPassword(user)(password))) {
                            return done(
                                new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.USERNAME_OR_PASSWORD_INCORRECT),
                                false
                            );
                        }

                        user = await this.userModel.findOne({ raw: true, where: { email } });

                        await this.annualizeAttempts(req.ip);

                        return done(null, { id: user.id });
                    } catch (err) {
                        done(err);
                        logger.error(err);
                    }
                }
            )
        );

        this.passport.use(
            new JwtStrategy(
                {
                    jwtFromRequest: ExtractJwt.fromExtractors([
                        tokenExtractorFromCookie,
                        ExtractJwt.fromAuthHeaderAsBearerToken(),
                    ]),
                    secretOrKey: process.env.JWT_SECRET_KEY,
                    // issuer: 'spaceboo',
                    // audience: 'www.spaceboo.com',
                },
                async (jwt_payload, done) => {
                    try {
                        const user = await this.userModel
                            .scope(UserScopes.WITH_CONFIRMED)
                            .findOne({ where: { id: jwt_payload.id }, raw: true });

                        if (!user) {
                            return done(new AppError(HttpStatus.FORBIDDEN, ErrorMessages.USER_NOT_FOUND), false);
                        } else if (!user.confirmed) {
                            return done(new AppError(HttpStatus.FORBIDDEN, ErrorMessages.USER_NOT_CONFIRMED), false);
                        }

                        return done(null, { id: user.id });
                    } catch (err) {
                        return done(err, false);
                    }
                }
            )
        );
    }

    public userSerialization() {
        this.passport.serializeUser((user: User, done: Function) => {
            done(null, user.id);
        });

        this.passport.deserializeUser(async (id: string, done: Function) => {
            try {
                const user = await this.userDao.findById(id as string);
                done(null, user);
            } catch (err) {
                done(err);
            }
        });
    }
}

export const passportConfig = SingletonFactory.produce<PassportConfig>(PassportConfig);
