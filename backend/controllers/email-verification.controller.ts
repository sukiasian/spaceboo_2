import { emailVerificationSequelizeDao, EmailVerificationSequelizeDao } from '../daos/email-verification.dao';
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
    private readonly userModel: typeof User = User;
    private readonly sendMail = sendMail;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public sendVerificationCodeByPurpose = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { purpose: emailPurpose } = req.params;
        const { email } = req.body;
        const user = await this.userModel.findOne({
            where: {
                email,
            },
        });

        if (!user) {
            throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.USER_NOT_FOUND);
        }

        const code = await this.emailVerificationDao.createAndStoreVerificationCodeInDb(email);
        let emailOptions: EmailOptions;

        switch (emailPurpose) {
            case EmailPurpose[10]: {
                emailOptions = new ConfirmEmailOptions(email);

                await this.sendMail<IConfirmEmailLocals>(emailOptions, RelativePathsToTemplates.CONFIRM_EMAIL, {
                    name: user.name,
                    code,
                });

                break;
            }

            case EmailPurpose[11]: {
                emailOptions = new PasswordRecoveryEmailOptions(email);

                await this.sendMail<IRecoverPasswordLocals>(emailOptions, RelativePathsToTemplates.CONFIRM_EMAIL, {
                    name: user.name,
                    code,
                });

                break;
            }
        }

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.EMAIL_SENT);
    });

    public checkVerificationCode = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        // NOTE возможно нам нужно брать email из sessionStorage
        const { currentCode, email } = req.body;
        const verificationCode = await this.emailVerificationDao.getVerificationCodeFromDb(email, currentCode);

        if (!verificationCode || currentCode !== verificationCode.code) {
            throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.VERIFICATION_CODE_NOT_VALID);
        }

        const user = await this.userModel.findOne({ where: { email } });

        if (!user) {
            throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.USER_NOT_FOUND);
        }

        await this.utilFunctions.signTokenAndStoreInCookies(res, { id: user.id });

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.VERIFICATION_CODE_VALID);
    });
}

export const emailVerificationController =
    SingletonFactory.produce<EmailVerificationController>(EmailVerificationController);
