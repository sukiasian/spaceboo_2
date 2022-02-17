import * as path from 'path';
import * as fs from 'fs';
import { User } from '../models/user.model';
import { Singleton, SingletonFactory } from './Singleton';
import UtilFunctions from './UtilFunctions';
import { appConfig } from '../AppConfig';
import { Appointment, IAppointment } from '../models/appointment.model';
import { Space } from '../models/space.model';
import logger from '../loggers/logger';
import { verificationCodeValidityInterval } from '../controllers/email-verification.controller';
import { EmailVerification } from '../models/email-verification.model';

export class NodeCronFunctions extends Singleton {
    private readonly pathToImagesDir = 'assets/images';
    private readonly userModel: typeof User = User;
    private readonly spaceModel: typeof Space = Space;
    private readonly appointmentModel: typeof Appointment = Appointment;
    private readonly emailVerificationModel: typeof EmailVerification = EmailVerification;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;
    private readonly sequelize = appConfig.sequelize;
    private readonly logger = logger;
    private readonly verificationCodeValidityInterval = verificationCodeValidityInterval;

    public archiveOutdatedAppointments = async (): Promise<void> => {
        try {
            const todayIso = new Date().toISOString();
            const getOutdatedAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE UPPER(a."isoDatesReserved") < '${todayIso}';`;
            const outdatedAppointments = (await this.utilFunctions.createSequelizeRawQuery(
                this.sequelize,
                getOutdatedAppointmentsRawQuery
            )) as IAppointment[];

            await Promise.all(
                outdatedAppointments.map(async (appointment) => {
                    const app = await this.appointmentModel.findOne({ where: { id: appointment.id } });

                    await app.update({ archived: true });
                })
            );
        } catch (err) {
            this.logger.error(err);
        }
    };

    public removeOutdatedUserAvatarsFromStorage = async (): Promise<void> => {
        try {
            const users: User[] = await this.userModel.findAll();

            for (const user of users) {
                const pathToUserDir = path.resolve(this.pathToImagesDir, user.id);
                const imagesNames = fs.readdirSync(pathToUserDir);

                for (const imageName of imagesNames) {
                    const relativePathToUserAvatar = `${this.pathToImagesDir}/${imageName}`;

                    if (user.avatarUrl === relativePathToUserAvatar) {
                        fs.rmSync(relativePathToUserAvatar);

                        break;
                    }
                }
            }
        } catch (err) {
            this.logger.error(err);
        }
    };

    public removeOutdatedSpaceImagesFromStorage = async (): Promise<void> => {
        try {
            const spaces: Space[] = await this.spaceModel.findAll();

            for (const space of spaces) {
                const pathToUserDir = path.resolve(this.pathToImagesDir, space.userId);
                const imagesNames = fs.readdirSync(pathToUserDir);
                const spaceImages = space.imagesUrl;

                for (const imageName of imagesNames) {
                    const relativePathToSpaceImage = `${this.pathToImagesDir}/${imageName}`;

                    for (const spaceImage of spaceImages) {
                        if (spaceImage === relativePathToSpaceImage) {
                            continue;
                        }

                        fs.rmSync(relativePathToSpaceImage);
                    }
                }
            }
        } catch (err) {
            this.logger.error(err);
        }
    };

    public removeOutdatedEmailsFromDb = async (): Promise<void> => {
        try {
            const dateIntervalAgo = new Date(Date.now() - this.verificationCodeValidityInterval).toISOString();
            const getOutdatedVerificationCodesRawQuery = `SELECT * FROM "EmailVerification" ev WHERE ev."createdAt" < '${dateIntervalAgo}'`;
            const outdatedVerificationCodes = (await this.utilFunctions.createSequelizeRawQuery(
                this.sequelize,
                getOutdatedVerificationCodesRawQuery
            )) as EmailVerification[];

            await Promise.all(
                outdatedVerificationCodes.map(async (code) => {
                    const outdatedVerificationCode = await this.emailVerificationModel.findOne({
                        where: {
                            id: code.id,
                        },
                    });

                    await outdatedVerificationCode.destroy();
                })
            );
        } catch (err) {
            this.logger.error(err);
        }
    };
}

export const nodeCronFunctions = SingletonFactory.produce<NodeCronFunctions>(NodeCronFunctions);
