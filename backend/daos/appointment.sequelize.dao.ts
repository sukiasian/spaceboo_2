import { appConfig } from '../AppConfig';
import { Dao } from '../configurations/dao.config';
import { IResIsoDatesReserved } from '../../frontend/src/types/types';
import { Appointment, IAppointment } from '../models/appointment.model';
import { ErrorMessages, HttpStatus } from '../types/enums';
import AppError from '../utils/AppError';
import { SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

export class AppointmentSequelizeDao extends Dao {
    private readonly appointmentModel: typeof Appointment = Appointment;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    get model(): typeof Appointment {
        return this.appointmentModel;
    }

    public createAppointment = async (
        resIsoDatesToReserve: IResIsoDatesReserved,
        spaceId: string,
        userId: string
    ): Promise<Appointment> => {
        const { beginningDate, beginningTime, endingDate, endingTime } = resIsoDatesToReserve;
        const isoDatesToReserveToCheckAvailability = this.utilFunctions.createIsoDatesRangeToFindAppointments(
            beginningDate,
            beginningTime,
            endingDate,
            endingTime
        );
        const isAvailable = await this.checkAvailability(spaceId, isoDatesToReserveToCheckAvailability);

        if (isAvailable) {
            const isoDatesToReserveToCreateAppointment = this.utilFunctions.createIsoDatesRangeToCreateAppointments(
                beginningDate,
                beginningTime,
                endingDate,
                endingTime
            );

            return this.model.create({ isoDatesReserved: isoDatesToReserveToCreateAppointment, spaceId, userId });
        } else {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.SPACE_IS_UNAVAILABLE);
        }
    };

    public getAppointmentsByUserId = async (userId: string): Promise<Appointment[]> => {
        // NOTE: здесь нет проблемы с sql injection

        // isoDatesReserved должно быть больше Date.now()
        const findUserAppointmentsRawQuery = `SELECT * FROM "Appointments" WHERE "spaceId" = ${userId} AND "isoDatesReserved" && `;

        return Appointment.findAll();
    };

    public checkAvailability = async (spaceId: string, isoDatesToReserve: string): Promise<boolean> => {
        // FIXME: здесь может быть проблема с SQLInjection так как spaceId исходит либо из req.params либо из req.body. Лучше использовать regexp.
        const findAppointmentRawQuery = `SELECT COUNT(*) FROM "Appointments" WHERE "spaceId" = '${spaceId}' AND "isoDatesReserved" && '${isoDatesToReserve}';`;
        const appointmentCount = await this.utilFunctions.createSequelizeRawQuery(
            appConfig.sequelize,
            findAppointmentRawQuery
        );

        switch (appointmentCount[0].count) {
            case '0':
                return true;

            case '1':
                return false;
        }
    };

    public getUserOutdatedAppointments = async (userId: string): Promise<IAppointment[]> => {
        const now = new Date().toISOString();
        const getOutdatedAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND UPPER(a."isoDatesReserver") < '${now}'`;
        const outdatedAppointments = (await this.utilFunctions.createSequelizeRawQuery(
            appConfig.sequelize,
            getOutdatedAppointmentsRawQuery
        )) as IAppointment[];

        return outdatedAppointments;
    };

    public getUserActiveAppointments = async (userId: string): Promise<IAppointment[]> => {
        const now = new Date().toISOString();
        // NOTE: should overlap
        const getActiveAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND UPPER(a."isoDatesReserver") < '${now}'`;
        const activeAppointments = (await this.utilFunctions.createSequelizeRawQuery(
            appConfig.sequelize,
            getActiveAppointmentsRawQuery
        )) as IAppointment[];

        return activeAppointments;
    };

    public getUserUpcomingAppointments = async (userId: string): Promise<IAppointment[]> => {
        const now = new Date().toISOString();
        // NOTE: lower  bound should be higher than now
        const getActiveAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND UPPER(a."isoDatesReserver") < '${now}'`;
        const upcomingAppointments = (await this.utilFunctions.createSequelizeRawQuery(
            appConfig.sequelize,
            getActiveAppointmentsRawQuery
        )) as IAppointment[];

        return upcomingAppointments;
    };
}

export const appointmentSequelizeDao = SingletonFactory.produce<AppointmentSequelizeDao>(AppointmentSequelizeDao);
