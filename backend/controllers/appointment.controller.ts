import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { HttpStatus, ResponseMessages } from '../types/enums';
import { appointmentSequelizeDao, AppointmentSequelizeDao } from '../daos/appointment.sequelize.dao';

export class AppointmentController extends Singleton {
    private readonly dao: AppointmentSequelizeDao = appointmentSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public createAppointment = this.utilFunctions.catchAsync(async (req, res, next) => {
        // TODO check if the date is not in the past !!!
        //  --> создать объект даты исходя из resIsoDatesToReserve.beginningDate, и сверить его с датой сейчас - если меньше то отбой если же больше то ок
        const { resIsoDatesToReserve, spaceId } = req.body;
        const userId = req.user.id;

        resIsoDatesToReserve.beginningTime = resIsoDatesToReserve.beginningTime ?? '14:00';
        resIsoDatesToReserve.endingTime = resIsoDatesToReserve.endingTime ?? '12:00';

        const appointment = await this.dao.createAppointment(resIsoDatesToReserve, spaceId, userId);

        this.utilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.APPOINTMENT_CREATED, appointment);
    });

    // PASS THE SPACE LITERALLY
    public stopAppointment = this.utilFunctions.catchAsync(async (req, res, next) => {});
}

export const appointmentController = SingletonFactory.produce<AppointmentController>(AppointmentController);
