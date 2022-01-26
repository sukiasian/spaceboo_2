"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentController = exports.AppointmentController = void 0;
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const enums_1 = require("../types/enums");
const appointment_sequelize_dao_1 = require("../daos/appointment.sequelize.dao");
class AppointmentController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = appointment_sequelize_dao_1.appointmentSequelizeDao;
        this.createAppointment = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            var _a, _b;
            // TODO check if the date is not in the past !!!
            const { resIsoDatesToReserve, spaceId } = req.body;
            const userId = req.user.id;
            resIsoDatesToReserve.beginningTime = (_a = resIsoDatesToReserve.beginningTime) !== null && _a !== void 0 ? _a : '14:00';
            resIsoDatesToReserve.endingTime = (_b = resIsoDatesToReserve.endingTime) !== null && _b !== void 0 ? _b : '12:00';
            const appointment = await this.dao.createAppointment(resIsoDatesToReserve, spaceId, userId);
            UtilFunctions_1.default.sendResponse(res)(enums_1.HttpStatus.CREATED, enums_1.ResponseMessages.APPOINTMENT_CREATED, appointment);
        });
        // PASS THE SPACE LITERALLY
        this.stopAppointment = UtilFunctions_1.default.catchAsync(async (req, res, next) => { });
    }
}
exports.AppointmentController = AppointmentController;
exports.appointmentController = Singleton_1.SingletonFactory.produce(AppointmentController);
//# sourceMappingURL=appointment.controller.js.map