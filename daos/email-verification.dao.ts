import { Dao } from '../configurations/dao.config';
import { EmailVerification } from '../models/email-verification.model';
import { SingletonFactory } from '../utils/Singleton';

export class EmailVerificationSequelizeDao extends Dao {
    private readonly emailVerificationModel: typeof EmailVerification = EmailVerification;

    get model(): typeof EmailVerification {
        return this.emailVerificationModel;
    }

    private generateVerificationCode = (): number => {
        // TODO create 6 digit code which lately will be split into an arrya of 6 numbers
        // and looped in pug (or right here).

        return Math.floor(Math.random() * 900000) + 100000;
    };

    public createAndStoreVerificationCodeInDb = async (email: string): Promise<number> => {
        const verificationCode = this.generateVerificationCode();

        await this.model.create({ code: verificationCode, email });

        return verificationCode;
    };

    public getVerificationCodeFromDb = async (email: string, currentCode: number): Promise<EmailVerification> => {
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

export const emailVerificationSequelizeDao =
    SingletonFactory.produce<EmailVerificationSequelizeDao>(EmailVerificationSequelizeDao);
