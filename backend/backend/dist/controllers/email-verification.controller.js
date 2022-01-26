"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationController = exports.EmailVerificationController = void 0;
const auth_sequelize_dao_1 = require("../daos/auth.sequelize.dao");
const email_verification_dao_1 = require("../daos/email-verification.dao");
const user_sequelize_dao_1 = require("../daos/user.sequelize.dao");
const Email_1 = require("../emails/Email");
const EmailOptions_1 = require("../emails/EmailOptions");
const email_verification_router_1 = require("../routes/email-verification.router");
const enums_1 = require("../types/enums");
const AppError_1 = require("../utils/AppError");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
class EmailVerificationController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.emailVerificationDao = email_verification_dao_1.emailVerificationSequelizeDao;
        this.userSequelizeDao = user_sequelize_dao_1.userSequelizeDao;
        this.authSequelizeDao = auth_sequelize_dao_1.authSequelizeDao;
        this.sendMail = Email_1.sendMail;
        this.utilFunctions = UtilFunctions_1.default;
        this.sendVerificationCodeByPurpose = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { purpose: emailPurpose } = req.params;
            const user = res.locals.user;
            let code;
            if (user.lastVerificationRequested) {
                const interval = 2 * 60 * 1000;
                if (Date.now() - user.lastVerificationRequested < interval) {
                    throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.WAIT_BEFORE_GETTING_EMAIL);
                }
            }
            code = await this.emailVerificationDao.createAndStoreVerificationCodeInDb(user.email);
            let emailOptions;
            switch (emailPurpose) {
                case email_verification_router_1.EmailPurpose[10]: {
                    emailOptions = new EmailOptions_1.ConfirmEmailOptions(user.email);
                    // FIXME ConfirmEmail or ConfirmAccount? Should finally be defined!
                    await this.sendMail(emailOptions, Email_1.RelativePathsToTemplates.CONFIRM_EMAIL, {
                        name: user.name,
                        code,
                    });
                    break;
                }
                case email_verification_router_1.EmailPurpose[11]: {
                    emailOptions = new EmailOptions_1.PasswordRecoveryEmailOptions(user.email);
                    await this.sendMail(emailOptions, Email_1.RelativePathsToTemplates.CONFIRM_EMAIL, {
                        name: user.name,
                        code,
                    });
                    break;
                }
            }
            await this.userSequelizeDao.updateUserLastVerificationRequest(user);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.EMAIL_SENT, {
                lastVerificationRequested: user.lastVerificationRequested,
            });
        });
        this.checkVerificationCodeAndProcessRequest = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { currentCode, recovery, confirmation } = req.body;
            const user = res.locals.user;
            const verificationCode = await this.emailVerificationDao.getVerificationCodeFromDb(user.email, currentCode);
            if (!verificationCode || currentCode !== verificationCode.code) {
                throw new AppError_1.default(enums_1.HttpStatus.BAD_REQUEST, enums_1.ErrorMessages.VERIFICATION_CODE_NOT_VALID);
            }
            const interval = 15 * 60 * 1000;
            const codeCreatedAt = new Date(verificationCode.createdAt).getTime();
            if (Date.now() - codeCreatedAt > interval) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.EXPIRED_REQUEST);
            }
            // TODO use private functions instead, and the implementation will become pretty good.
            if (recovery) {
                await this.processRecovery(res, { id: user.id, recovery: true }, { expiresIn: '15m' });
            }
            else if (confirmation) {
                await this.processConfirmation(user.id);
            }
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.VERIFICATION_CODE_VALID);
            await verificationCode.destroy();
            await user.update({ lastVerificationRequested: undefined });
        });
        this.processRecovery = async (res, jwtPayload, signOptions = {}) => {
            await this.utilFunctions.signTokenAndStoreInCookies(res, jwtPayload, signOptions);
        };
        this.processConfirmation = async (userId) => {
            await this.authSequelizeDao.confirmAccount(userId);
        };
    }
}
exports.EmailVerificationController = EmailVerificationController;
exports.emailVerificationController = Singleton_1.SingletonFactory.produce(EmailVerificationController);
//# sourceMappingURL=email-verification.controller.js.map