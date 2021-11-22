import { CookieOptions } from 'express';
import { promisify } from 'util';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { Environment, HttpStatus, ResponseMessages } from '../types/enums';
import { authSequelizeDao, AuthSequelizeDao } from '../daos/auth.sequelize.dao';
import UtilFunctions from '../utils/UtilFunctions';

export class AuthController extends Singleton {
    private readonly dao: AuthSequelizeDao = authSequelizeDao;

    public signUpLocal = UtilFunctions.catchAsync(async (req, res, next) => {
        const user = await this.dao.signUpLocal(req.body);

        await this.signTokenAndStoreInCookies(user.id, res);
        UtilFunctions.sendResponse(res)(201, ResponseMessages.USER_CREATED, user);
        // NOTE not sure if we need to return the user here - need to check one more time.
    });

    public signInLocal = UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const user = await this.dao.findById(req.user.id);

        await this.signTokenAndStoreInCookies(user.id, res);
        UtilFunctions.sendResponse(res)(HttpStatus.OK, 'Добро пожаловать на Spaceboo!', user);
    });

    public signOut = () => {}; // NOTE NOTE NOTE this should be done on the client side

    private signTokenAndStoreInCookies = async (userId: string, res): Promise<void> => {
        const signToken = promisify(jwt.sign);
        const token = await signToken(userId, process.env.JWT_SECRET_KEY);
        const cookieOptions: CookieOptions = {
            httpOnly: true,
            expires: new Date(Date.now() + 90 * 24 * 3600000),
            secure: false,
        };

        if (process.env.NODE_ENV === Environment.PRODUCTION) {
            cookieOptions.secure = true;
        }

        res.cookie('jwt', token, cookieOptions);
    };
}

export const authController = SingletonFactory.produce<AuthController>(AuthController);
