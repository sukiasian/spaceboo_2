"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentController = exports.AppointmentController = void 0;
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const enums_1 = require("../types/enums");
const appointment_sequelize_dao_1 = require("../daos/appointment.sequelize.dao");
const AppError_1 = require("../utils/AppError");
class AppointmentController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = appointment_sequelize_dao_1.appointmentSequelizeDao;
        this.utilFunctions = UtilFunctions_1.default;
        this.createAppointment = this.utilFunctions.catchAsync(async (req, res, next) => {
            var _a, _b;
            // TODO check if the date is not in the past !!!
            //  --> создать объект даты исходя из resIsoDatesToReserve.beginningDate, и сверить его с датой сейчас - если меньше то отбой если же больше то ок
            const { resIsoDatesToReserve, spaceId } = req.body;
            // if (this.datesAreInThePast(resIsoDatesToReserve.beginningDate)) {
            //     throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.DATES_SHOULD_BE_PRESENT);
            // }
            // NOTE скорее всего нам нужно будет парсить время из локального в UTC.
            const userId = req.user.id;
            resIsoDatesToReserve.beginningTime = (_a = resIsoDatesToReserve.beginningTime) !== null && _a !== void 0 ? _a : '14:00';
            resIsoDatesToReserve.endingTime = (_b = resIsoDatesToReserve.endingTime) !== null && _b !== void 0 ? _b : '12:00';
            const appointment = await this.dao.createAppointment(resIsoDatesToReserve, spaceId, userId);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.CREATED, enums_1.ResponseMessages.APPOINTMENT_CREATED, appointment);
        });
        this.getAppointmentsByRequiredDates = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { requiredDates, spaceId } = req.query;
            if (!requiredDates) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.REQUIRED_DATES_ARE_MISSING);
            }
            if (!spaceId) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.SPACE_ID_IS_MISSING);
            }
            const appointments = await this.dao.getAppointmentsByRequiredDates(spaceId, requiredDates);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, appointments);
        });
        // PASS THE SPACE LITERALLY
        this.stopAppointment = this.utilFunctions.catchAsync(async (req, res, next) => { });
        this.datesAreInThePast = (beginningDate) => {
            // NOTE не учитывается время ? Как мы договаривались, все записывать в 0 timezone?
            const date = new Date(beginningDate).getUTCMilliseconds();
            return date < Date.now();
        };
    }
}
exports.AppointmentController = AppointmentController;
exports.appointmentController = Singleton_1.SingletonFactory.produce(AppointmentController);
//# sourceMappingURL=appointment.controller.js.map