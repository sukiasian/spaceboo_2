import * as express from 'express';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { ErrorMessages, HttpStatus, ResponseMessages } from '../types/enums';
import { authSequelizeDao, AuthSequelizeDao } from '../daos/auth.sequelize.dao';
import UtilFunctions from '../utils/UtilFunctions';
import { UserScopes } from '../models/user.model';
import AppError from '../utils/AppError';

interface IUserLoginState {
    loggedIn: boolean;
    confirmed: boolean;
}

export class AuthController extends Singleton {
    private readonly authSequelizeDao: AuthSequelizeDao = authSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public signUpLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
        const user = await this.authSequelizeDao.signUpLocal(req.body);

        await this.utilFunctions.signTokenAndStoreInCookies(res, { id: user.id });

        this.utilFunctions.sendResponse(res)(201, ResponseMessages.USER_CREATED, user);
    });

    public signInLocal = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const user = await this.authSequelizeDao.findById(req.user.id);

        await this.utilFunctions.signTokenAndStoreInCookies(res, { id: user.id });

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, 'Добро пожаловать на Spaceboo!', user);
    });

    public editUserPassword = this.utilFunctions.catchAsync(async (req, res: express.Response, next): Promise<void> => {
        const { id: userId } = req.user;
        const recovery = req.user.recovery || false;
        const passwordData = req.body.passwordData;

        await this.authSequelizeDao.editUserPassword(userId, passwordData, recovery);

        recovery
            ? this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.PASSWORD_RECOVERED)
            : this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.PASSWORD_EDITED);
    });

    public getUserLoginState = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const token = req.cookies['jwt'] as string;
        let userLoginState: IUserLoginState = {
            loggedIn: false,
            confirmed: false,
        };

        if (token) {
            const verifyToken: (
                arg1: string,
                arg2: jwt.Secret,
                arg3?: jwt.VerifyOptions & { complete: true }
            ) => Promise<string | jwt.Jwt> = promisify<
                string,
                jwt.Secret,
                jwt.VerifyOptions & { complete: true },
                string | jwt.Jwt
            >(jwt.verify);

            const payload: string | jwt.JwtPayload = jwt.decode(token);
            const user = await this.authSequelizeDao.model.scope(UserScopes.WITH_CONFIRMED).findOne({
                where: {
                    id: (payload as jwt.JwtPayload).id,
                },
            });

            if (!user) {
                userLoginState = {
                    loggedIn: false,
                    confirmed: false,
                };

                return this.utilFunctions.sendResponse(res)(
                    HttpStatus.OK,
                    ResponseMessages.USER_NOT_FOUND,
                    userLoginState
                );
            }

            const verifiedToken = await verifyToken(token, process.env.JWT_SECRET_KEY);

            if (verifiedToken) {
                if (user.confirmed) {
                    userLoginState = {
                        loggedIn: true,
                        confirmed: true,
                    };

                    return this.utilFunctions.sendResponse(res)(
                        HttpStatus.OK,
                        ResponseMessages.USER_IS_CONFIRMED,
                        userLoginState
                    );
                } else {
                    userLoginState = {
                        loggedIn: true,
                        confirmed: false,
                    };

                    return this.utilFunctions.sendResponse(res)(
                        HttpStatus.OK,
                        ResponseMessages.USER_IS_LOGGED_IN,
                        userLoginState
                    );
                }
            }
        }

        return this.utilFunctions.sendResponse(res)(
            HttpStatus.OK,
            ResponseMessages.USER_IS_NOT_LOGGED_IN,
            userLoginState
        );

        // FIXME нужно при ошибке отправлять еще один запрос на проверку - делаться должно это в саге
    });

    public logout = this.utilFunctions.catchAsync(
        async (req: express.Request, res: express.Response, next): Promise<void> => {
            const cookie = req.cookies['jwt'];

            if (cookie) {
                res.clearCookie('jwt');

                return this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.LOGGED_OUT);
            }

            throw new AppError(HttpStatus.UNAUTHORIZED, ErrorMessages.NOT_AUTHORIZED);
        }
    );
}

export const authController = SingletonFactory.produce<AuthController>(AuthController);
