import { Op } from 'sequelize';
import { Dao } from '../configurations/dao.config';
import { Appointment, TIsoDatesReserved } from '../models/appointment.model';
import { SingletonFactory } from '../utils/Singleton';

export class AppointmentSequelizeDao extends Dao {
    private readonly appointmentModel: typeof Appointment = Appointment;

    get model(): typeof Appointment {
        return this.appointmentModel;
    }

    public createAppointment = async (
        isoDatesReserved: TIsoDatesReserved,
        spaceId: string,
        userId: string
    ): Promise<Appointment> => {
        // use space id and check if space is available

        return this.model.create({ isoDatesReserved, spaceId, userId });
    };

    public checkAvailability = async (isoDatesToReserve: any): Promise<boolean> => {
        const appointment = await this.model.findOne({
            where: {
                [Op.or]: [
                    {
                        isoDatesReserved: {
                            [Op.contains]: isoDatesToReserve,
                        },
                    },
                    {
                        isoDatesReserved: {
                            [Op.contained]: isoDatesToReserve,
                        },
                    },
                ],
            },
        });

        return appointment ? false : true;
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
