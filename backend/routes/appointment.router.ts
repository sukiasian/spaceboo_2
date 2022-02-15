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
            );

        this.router
            .route('/user/outdated')
            .get(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.appointmentController.getUserOutdatedAppointments
            );

        this.router
            .route('/user/active')
            .get(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.appointmentController.getUserActiveAppointments
            );

        this.router
            .route('/user/upcoming')
            .post(
                this.passport.authenticate(PassportStrategies.JWT, { session: false }),
                this.appointmentController.getUserUpcomingAppointments
            );
    };
}

const appointmentRouter = SingletonFactory.produce<AppointmentRouter>(AppointmentRouter);

appointmentRouter.prepareRouter();

export const router = appointmentRouter.router;
