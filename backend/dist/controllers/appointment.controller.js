"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentController = exports.AppointmentController = void 0;
const dotenv = require("dotenv");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const enums_1 = require("../types/enums");
const appointment_sequelize_dao_1 = require("../daos/appointment.sequelize.dao");
const AppError_1 = require("../utils/AppError");
dotenv.config();
class AppointmentController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = appointment_sequelize_dao_1.appointmentSequelizeDao;
        this.createAppointment = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const { isoDatesToReserve, spaceId } = req.body;
            const userId = req.user.id;
            const availability = await this.dao.checkAvailability(isoDatesToReserve);
            if (!availability) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.SPACE_IS_UNAVAILABLE);
            }
            const appointment = await this.dao.createAppointment(isoDatesToReserve, spaceId, userId);
            UtilFunctions_1.default.sendResponse(res)(enums_1.HttpStatus.CREATED, enums_1.ResponseMessages.APPOINTMENT_CREATED, appointment);
        });
        this.stopAppointment = UtilFunctions_1.default.catchAsync(async (req, res, next) => { });
    }
}
exports.AppointmentController = AppointmentController;
// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
exports.appointmentController = Singleton_1.SingletonFactory.produce(AppointmentController);
//# sourceMappingURL=appointment.controller.js.map