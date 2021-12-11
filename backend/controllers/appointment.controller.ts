import * as dotenv from 'dotenv';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { HttpStatus, ResponseMessages } from '../types/enums';
import { appointmentSequelizeDao, AppointmentSequelizeDao } from '../daos/appointment.sequelize.dao';

export class AppointmentController extends Singleton {
    private readonly dao: AppointmentSequelizeDao = appointmentSequelizeDao;

    public createAppointment = UtilFunctions.catchAsync(async (req, res, next) => {
        // TODO check if the date is not in the past !!!
        const { resIsoDatesToReserve, spaceId } = req.body;
        const userId = req.user.id;
        const appointment = await this.dao.createAppointment(resIsoDatesToReserve, spaceId, userId);

        UtilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.APPOINTMENT_CREATED, appointment);
    });

    // PASS THE SPACE LITERALLY
    public stopAppointment = UtilFunctions.catchAsync(async (req, res, next) => {});
}

export const appointmentController = SingletonFactory.produce<AppointmentController>(AppointmentController);