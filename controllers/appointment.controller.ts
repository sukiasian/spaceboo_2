import * as dotenv from 'dotenv';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { ErrorMessages, HttpStatus, ResponseMessages, SequelizeModelProps } from '../types/enums';
import { appointmentSequelizeDao, AppointmentSequelizeDao } from '../daos/appointment.sequelize.dao';
import AppError from '../utils/AppError';

dotenv.config();

export class AppointmentController extends Singleton {
    private readonly dao: AppointmentSequelizeDao = appointmentSequelizeDao;

    public createAppointment = UtilFunctions.catchAsync(async (req, res, next) => {
        const { isoDatesToReserve, spaceId } = req.body;
        const userId = req.user.id;
        const availability = await this.dao.checkAvailability(isoDatesToReserve);

        if (!availability) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.SPACE_IS_UNAVAILABLE);
        }

        const appointment = await this.dao.createAppointment(isoDatesToReserve, spaceId, userId);

        UtilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.APPOINTMENT_CREATED, appointment);
    });
    public stopAppointment = UtilFunctions.catchAsync(async (req, res, next) => {});
}

// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
export const appointmentController = SingletonFactory.produce<AppointmentController>(AppointmentController);
