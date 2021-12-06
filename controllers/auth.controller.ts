import * as express from 'express';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { HttpStatus, ResponseMessages } from '../types/enums';
import { authSequelizeDao, AuthSequelizeDao } from '../daos/auth.sequelize.dao';
import UtilFunctions from '../utils/UtilFunctions';
import { sendMail } from '../emails/Email';

export class AuthController extends Singleton {
    private readonly authSequelizeDao: AuthSequelizeDao = authSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;
    private readonly sendEmail = sendMail;

    public signUpLocal = this.utilFunctions.catchAsync(async (req, res, next) => {
        const user = await this.authSequelizeDao.signUpLocal(req.body);

        await this.utilFunctions.signTokenAndStoreInCookies(res, { id: user.id });

        this.utilFunctions.sendResponse(res)(201, ResponseMessages.USER_CREATED, user);
    });

    public signInLocal = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const user = await this.authSequelizeDao.findById(req.user.id);
        // NOTE
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
}

export const authController = SingletonFactory.produce<AuthController>(AuthController);
