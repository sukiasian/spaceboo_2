import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { ErrorMessages, HttpStatus, ResponseMessages } from '../types/enums';
import { appointmentSequelizeDao, AppointmentSequelizeDao } from '../daos/appointment.sequelize.dao';
import AppError from '../utils/AppError';

export class AppointmentController extends Singleton {
    private readonly dao: AppointmentSequelizeDao = appointmentSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public createAppointment = this.utilFunctions.catchAsync(async (req, res, next) => {
        // TODO check if the date is not in the past !!!
        //  --> создать объект даты исходя из resIsoDatesToReserve.beginningDate, и сверить его с датой сейчас - если меньше то отбой если же больше то ок
        const { resIsoDatesToReserve, spaceId } = req.body;

        // if (this.datesAreInThePast(resIsoDatesToReserve.beginningDate)) {
        //     throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.DATES_SHOULD_BE_PRESENT);
        // }

        // NOTE скорее всего нам нужно будет парсить время из локального в UTC.

        const userId = req.user.id;

        resIsoDatesToReserve.beginningTime = resIsoDatesToReserve.beginningTime ?? '14:00';
        resIsoDatesToReserve.endingTime = resIsoDatesToReserve.endingTime ?? '12:00';

        const appointment = await this.dao.createAppointment(resIsoDatesToReserve, spaceId, userId);

        this.utilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.APPOINTMENT_CREATED, appointment);
    });

    public getAppointmentsByRequiredDates = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { requiredDates, spaceId } = req.query;

        if (!requiredDates) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.REQUIRED_DATES_ARE_MISSING);
        }

        if (!spaceId) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.SPACE_ID_IS_MISSING);
        }

        const appointments = await this.dao.getAppointmentsByRequiredDates(spaceId, requiredDates);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, appointments);
    });

    // PASS THE SPACE LITERALLY
    public stopAppointment = this.utilFunctions.catchAsync(async (req, res, next) => {});

    private datesAreInThePast = (beginningDate: string): boolean => {
        // NOTE не учитывается время ? Как мы договаривались, все записывать в 0 timezone?
        const date = new Date(beginningDate).getUTCMilliseconds();

        return date < Date.now();
    };
}

export const appointmentController = SingletonFactory.produce<AppointmentController>(AppointmentController);
