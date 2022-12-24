"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const passport = require("passport");
const appointment_controller_1 = require("../controllers/appointment.controller");
const enums_1 = require("../types/enums");
const Singleton_1 = require("../utils/Singleton");
class AppointmentRouter extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.appointmentController = appointment_controller_1.appointmentController;
        this.passport = passport;
        this.router = (0, express_1.Router)();
        this.prepareRouter = () => {
            this.router
                .route('/')
                .post(this.passport.authenticate(enums_1.PassportStrategies.JWT, { session: false }), this.appointmentController.createAppointment)
                .get(this.appointmentController.getAppointmentsByRequiredDates);
        };
    }
}
const appointmentRouter = Singleton_1.SingletonFactory.produce(AppointmentRouter);
appointmentRouter.prepareRouter();
exports.router = appointmentRouter.router;
//# sourceMappingURL=appointment.router.js.map