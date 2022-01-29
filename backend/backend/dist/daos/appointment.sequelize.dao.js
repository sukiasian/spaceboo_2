"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentSequelizeDao = exports.AppointmentSequelizeDao = void 0;
const App_1 = require("../App");
const dao_config_1 = require("../configurations/dao.config");
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
        this.checkAvailability = async (spaceId, isoDatesToReserve) => {
            const findAppointmentRawQuery = `SELECT COUNT(*) FROM "Appointments" WHERE "spaceId" = '${spaceId}' AND "isoDatesReserved" && '${isoDatesToReserve}';`;
            const appointmentCount = await this.utilFunctions.createSequelizeRawQuery(App_1.applicationInstance.sequelize, findAppointmentRawQuery);
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