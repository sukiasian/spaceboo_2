import * as dotenv from 'dotenv';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { HttpStatus, ResponseMessages } from '../types/enums';
import { appointmentSequelizeDao, AppointmentSequelizeDao } from '../daos/appointment.sequelize.dao';

dotenv.config();

export class AppointmentController extends Singleton {
    private readonly dao: AppointmentSequelizeDao = appointmentSequelizeDao;

    public createAppointment = UtilFunctions.catchAsync(async (req, res, next) => {
        const { datesToReserve, spaceId } = req.body;
        const userId = req.user.id;
        const appointment = await this.dao.createAppointment(datesToReserve, spaceId, userId);

        UtilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.APPOINTMENT_CREATED, appointment);
    });
}

// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
export const appointmentController = SingletonFactory.produce<AppointmentController>(AppointmentController);
