"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentSequelizeDao = exports.AppointmentSequelizeDao = void 0;
const AppConfig_1 = require("../AppConfig");
const dao_config_1 = require("../configurations/dao.config");
const uuid = require("uuid");
const appointment_model_1 = require("../models/appointment.model");
const enums_1 = require("../types/enums");
const AppError_1 = require("../utils/AppError");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
class AppointmentSequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.appointmentModel = appointment_model_1.Appointment;
        this.utilFunctions = UtilFunctions_1.default;
        this.createAppointment = async (resIsoDatesToReserve, spaceId, userId) => {
            const { beginningDate, beginningTime, endingDate, endingTime } = resIsoDatesToReserve;
            const isoDatesToReserveToCheckAvailability = this.utilFunctions.createIsoDatesRangeToFindAppointments(beginningDate, beginningTime, endingDate, endingTime);
            const isAvailable = await this.checkAvailability(spaceId, isoDatesToReserveToCheckAvailability);
            if (isAvailable) {
                const isoDatesToReserveToCreateAppointment = this.utilFunctions.createIsoDatesRangeToCreateAppointments(beginningDate, beginningTime, endingDate, endingTime);
                return this.model.create({ isoDatesReserved: isoDatesToReserveToCreateAppointment, spaceId, userId });
            }
            else {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.SPACE_IS_UNAVAILABLE);
            }
        };
        this.getAppointmentsByUserId = async (userId) => {
            // NOTE: здесь нет проблемы с sql injection
            // isoDatesReserved должно быть больше Date.now()
            const findUserAppointmentsRawQuery = `SELECT * FROM "Appointments" WHERE "userId" = ${userId} AND "isoDatesReserved" && `;
            return appointment_model_1.Appointment.findAll();
        };
        this.userHasActiveAppointmentsForSpace = async (userId, spaceId) => {
            if (!uuid.validate(userId) || !uuid.validate(spaceId)) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.INVALID_ID);
            }
            const getUserActiveAppointmentsForSpaceRawQuery = `SELECT * FROM "Appointments" WHERE "userId" = ${userId} AND "spaceId" = ${spaceId} AND "isoDatesReserved" @> CURRENT_TIMESTAMP;`;
            const activeAppointments = (await this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, getUserActiveAppointmentsForSpaceRawQuery));
            return !!activeAppointments;
        };
        this.getAppointmentsByRequiredDates = async (spaceId, requiredDates) => {
            const findAppointmentsRawQuery = `SELECT * FROM "Appointments" WHERE "spaceId" = '${spaceId}' AND "isoDatesReserved" && '${requiredDates}'::tstzrange`;
            return this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, findAppointmentsRawQuery);
        };
        // NOTE возможно public - для того чтобы запрашивать загруженность спейса на период
        this.checkAvailability = async (spaceId, isoDatesToReserve) => {
            // FIXME: здесь может быть проблема с SQLInjection так как spaceId исходит либо из req.params либо из req.body. Лучше использовать regexp.
            // или же можно проверить существует ли такой spaceId в базах и если да то продолжить.
            // но этот sql injection вряд ли сможет навредить - можно будет только узнать сколько спейсов имеют appointment на выбранную isoDatesToReserve
            const findAppointmentRawQuery = `SELECT COUNT(*) FROM "Appointments" WHERE "spaceId" = '${spaceId}' AND "isoDatesReserved" && '${isoDatesToReserve}';`;
            const appointmentCount = await this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, findAppointmentRawQuery);
            switch (appointmentCount[0].count) {
                case '0':
                    return true;
                case '1':
                    return false;
            }
        };
    }
    get model() {
        return this.appointmentModel;
    }
}
exports.AppointmentSequelizeDao = AppointmentSequelizeDao;
exports.appointmentSequelizeDao = Singleton_1.SingletonFactory.produce(AppointmentSequelizeDao);
//# sourceMappingURL=appointment.sequelize.dao.js.map