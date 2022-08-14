import { Router } from 'express';
import * as passport from 'passport';
import { appointmentController } from '../controllers/appointment.controller';
import { PassportStrategies } from '../types/enums';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class AppointmentRouter extends Singleton implements IRouter {
    private readonly appointmentController = appointmentController;
    private readonly passport = passport;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router
            .route('/')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.appointmentController.createAppointment
            )
            .get(this.appointmentController.getAppointmentsByRequiredDates);
    };
}

const appointmentRouter = SingletonFactory.produce<AppointmentRouter>(AppointmentRouter);

appointmentRouter.prepareRouter();

export const router = appointmentRouter.router;
