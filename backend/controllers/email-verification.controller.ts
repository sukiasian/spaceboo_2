import * as express from 'express';
import { emailVerificationSequelizeDao, EmailVerificationSequelizeDao } from '../daos/email-verification.dao';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import { RelativePathsToTemplates, sendMail } from '../emails/Email';
import { ConfirmEmailOptions, EmailOptions, PasswordRecoveryEmailOptions } from '../emails/EmailOptions';
import { IConfirmEmailLocals, IRecoverPasswordLocals } from '../emails/locals';
import { User } from '../models/user.model';
import { EmailPurpose } from '../routes/email-verification.router';
import { ErrorMessages, HttpStatus, ResponseMessages } from '../types/enums';
import AppError from '../utils/AppError';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

export class EmailVerificationController extends Singleton {
    private readonly emailVerificationDao: EmailVerificationSequelizeDao = emailVerificationSequelizeDao;
    private readonly userSequelizeDao: UserSequelizeDao = userSequelizeDao;
    private readonly sendMail = sendMail;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public sendVerificationCodeByPurpose = this.utilFunctions.catchAsync(
        async (req, res: express.Response, next): Promise<void> => {
            const { purpose: emailPurpose } = req.params;
            const user: User = res.locals.user;
            let code: number;

            if (user.lastVerificationRequested) {
                const interval = 2 * 60 * 1000;

                if (Date.now() - user.lastVerificationRequested < interval) {
                    throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.WAIT_BEFORE_GETTING_EMAIL);
                }
            }

            code = await this.emailVerificationDao.createAndStoreVerificationCodeInDb(user.email);

            let emailOptions: EmailOptions;

            switch (emailPurpose) {
                case EmailPurpose[10]: {
                    emailOptions = new ConfirmEmailOptions(user.email);

                    // FIXME ConfirmEmail or ConfirmAccount? Should finally be defined!
                    await this.sendMail<IConfirmEmailLocals>(emailOptions, RelativePathsToTemplates.CONFIRM_EMAIL, {
                        name: user.name,
                        code,
                    });

                    break;
                }

                case EmailPurpose[11]: {
                    emailOptions = new PasswordRecoveryEmailOptions(user.email);

                    await this.sendMail<IRecoverPasswordLocals>(emailOptions, RelativePathsToTemplates.CONFIRM_EMAIL, {
                        name: user.name,
                        code,
                    });

                    break;
                }
            }

            await this.userSequelizeDao.updateUserLastVerificationRequest(user);

            this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.EMAIL_SENT);
        }
    );

    public checkVerificationCode = this.utilFunctions.catchAsync(
        async (req, res: express.Response, next): Promise<void> => {
            const { currentCode, recovery } = req.body;
            const user: User = res.locals.user;
            const verificationCode = await this.emailVerificationDao.getVerificationCodeFromDb(user.email, currentCode);
            const interval = 15 * 60 * 1000;
            const codeCreatedAt = new Date(verificationCode.createdAt).getTime();

            if (Date.now() - codeCreatedAt > interval) {
                throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.EXPIRED_REQUEST);
            }

            if (!verificationCode || currentCode !== verificationCode.code) {
                throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.VERIFICATION_CODE_NOT_VALID);
            }

            if (recovery) {
                await this.utilFunctions.signTokenAndStoreInCookies(
                    res,
                    { id: user.id, recovery: true },
                    { expiresIn: '15m' }
                );
            }

            this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.VERIFICATION_CODE_VALID);
        }
    );
}

export const emailVerificationController =
    SingletonFactory.produce<EmailVerificationController>(EmailVerificationController);
