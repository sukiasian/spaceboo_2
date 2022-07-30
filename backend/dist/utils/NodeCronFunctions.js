"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodeCronFunctions = exports.NodeCronFunctions = void 0;
const path = require("path");
const fs = require("fs");
const user_model_1 = require("../models/user.model");
const Singleton_1 = require("./Singleton");
const UtilFunctions_1 = require("./UtilFunctions");
const AppConfig_1 = require("../AppConfig");
const appointment_model_1 = require("../models/appointment.model");
const space_model_1 = require("../models/space.model");
const logger_1 = require("../loggers/logger");
const email_verification_controller_1 = require("../controllers/email-verification.controller");
const email_verification_model_1 = require("../models/email-verification.model");
class NodeCronFunctions extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.pathToImagesDir = 'assets/images';
        this.userModel = user_model_1.User;
        this.spaceModel = space_model_1.Space;
        this.appointmentModel = appointment_model_1.Appointment;
        this.emailVerificationModel = email_verification_model_1.EmailVerification;
        this.utilFunctions = UtilFunctions_1.default;
        this.sequelize = AppConfig_1.appConfig.sequelize;
        this.logger = logger_1.default;
        this.verificationCodeValidityInterval = email_verification_controller_1.verificationCodeValidityInterval;
        this.archiveOutdatedAppointments = async () => {
            try {
                const todayIso = new Date().toISOString();
                const getOutdatedAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE UPPER(a."isoDatesReserved") < '${todayIso}';`;
                const outdatedAppointments = (await this.utilFunctions.createSequelizeRawQuery(this.sequelize, getOutdatedAppointmentsRawQuery));
                await Promise.all(outdatedAppointments.map(async (appointment) => {
                    const app = await this.appointmentModel.findOne({ where: { id: appointment.id } });
                    await app.update({ archived: true });
                }));
            }
            catch (err) {
                this.logger.error(err);
            }
        };
        this.removeOutdatedUserAvatarsFromStorage = async () => {
            try {
                const users = await this.userModel.findAll();
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
            }
            catch (err) {
                this.logger.error(err);
            }
        };
        this.removeOutdatedSpaceImagesFromStorage = async () => {
            try {
                const spaces = await this.spaceModel.findAll();
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
            }
            catch (err) {
                this.logger.error(err);
            }
        };
        this.removeOutdatedEmailsFromDb = async () => {
            try {
                const dateIntervalAgo = new Date(Date.now() - this.verificationCodeValidityInterval).toISOString();
                const getOutdatedVerificationCodesRawQuery = `SELECT * FROM "EmailVerification" ev WHERE ev."createdAt" < '${dateIntervalAgo}'`;
                const outdatedVerificationCodes = (await this.utilFunctions.createSequelizeRawQuery(this.sequelize, getOutdatedVerificationCodesRawQuery));
                await Promise.all(outdatedVerificationCodes.map(async (code) => {
                    const outdatedVerificationCode = await this.emailVerificationModel.findOne({
                        where: {
                            id: code.id,
                        },
                    });
                    await outdatedVerificationCode.destroy();
                }));
            }
            catch (err) {
                this.logger.error(err);
            }
        };
    }
}
exports.NodeCronFunctions = NodeCronFunctions;
exports.nodeCronFunctions = Singleton_1.SingletonFactory.produce(NodeCronFunctions);
//# sourceMappingURL=NodeCronFunctions.js.map