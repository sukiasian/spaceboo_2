"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailVerificationSequelizeDao = exports.EmailVerificationSequelizeDao = void 0;
const dao_config_1 = require("../configurations/dao.config");
const email_verification_model_1 = require("../models/email-verification.model");
const Singleton_1 = require("../utils/Singleton");
class EmailVerificationSequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.emailVerificationModel = email_verification_model_1.EmailVerification;
        this.generateVerificationCode = () => {
            // TODO create 6 digit code which lately will be split into an arrya of 6 numbers
            // and looped in pug (or right here).
            return Math.floor(Math.random() * 900000) + 100000;
        };
        this.createAndStoreVerificationCodeInDb = async (email) => {
            const verificationCode = this.generateVerificationCode();
            await this.model.create({ code: verificationCode, email });
            return verificationCode;
        };
        this.getVerificationCodeFromDb = async (email, currentCode) => {
            // возмодно отправить роу квери
            const verificationCode = await this.model.findOne({
                where: {
                    email,
                    code: currentCode,
                },
            });
            return verificationCode;
        };
    }
    get model() {
        return this.emailVerificationModel;
    }
}
exports.EmailVerificationSequelizeDao = EmailVerificationSequelizeDao;
exports.emailVerificationSequelizeDao = Singleton_1.SingletonFactory.produce(EmailVerificationSequelizeDao);
//# sourceMappingURL=email-verification.dao.js.map