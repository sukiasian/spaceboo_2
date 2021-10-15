import { Op } from 'sequelize';
import { Dao } from '../configurations/dao.config';
import { Appointment } from '../models/appointment.model';
import { SingletonFactory } from '../utils/Singleton';

export class AppointmentSequelizeDao extends Dao {
    private readonly appointmentModel: typeof Appointment = Appointment;

    get model(): typeof Appointment {
        return this.appointmentModel;
    }

    createAppointment = async (dates, spaceId: string, userId: string): Promise<Appointment> => {
        // use space id and check if space is available

        return this.model.create({ datesReserved: dates, spaceId, userId });
    };

    checkAvailability = async (dates): Promise<void | boolean> => {
        // const appointment = this.model.findOne({ where: { datesReserved: { [Op.between]: { dates }}} }); // true
        // return appointment ? false : true;
    };

    // getAppointmentsByPickedDates = async (data): Promise<Appointment[]> => {
    //     // FIXME fromDate and toDate should come from data
    //     const fromDate = new Date('09/19/2021').getTime();
    //     const toDate = new Date('09/20/2021').getTime();

    //     return await this.model.findAll({
    //         where: {
    //             startDate: {
    //                 [Op.notBetween]: [fromDate, toDate],
    //             },
    //         },
    //     });
    // };
}

export const appointmentSequelizeDao = SingletonFactory.produce<AppointmentSequelizeDao>(AppointmentSequelizeDao);
