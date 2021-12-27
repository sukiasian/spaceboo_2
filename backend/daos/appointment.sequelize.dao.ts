import { applicationInstance } from '../App';
import { Dao } from '../configurations/dao.config';
import { IResIsoDatesReserved } from '../../frontend/src/types/types';
import { Appointment } from '../models/appointment.model';
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

    public checkAvailability = async (spaceId: string, isoDatesToReserve: string): Promise<boolean> => {
        const findAppointmentRawQuery = `SELECT COUNT(*) FROM "Appointments" WHERE "spaceId" = '${spaceId}' AND "isoDatesReserved" && '${isoDatesToReserve}';`;
        const appointmentCount = await this.utilFunctions.createSequelizeRawQuery(
            applicationInstance.sequelize,
            findAppointmentRawQuery
        );

        switch (appointmentCount[0].count) {
            case '0':
                return true;

            case '1':
                return false;
        }
    };
}

export const appointmentSequelizeDao = SingletonFactory.produce<AppointmentSequelizeDao>(AppointmentSequelizeDao);
