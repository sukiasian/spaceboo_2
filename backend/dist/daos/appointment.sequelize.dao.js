"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentSequelizeDao = exports.AppointmentSequelizeDao = void 0;
const sequelize_1 = require("sequelize");
const dao_config_1 = require("../configurations/dao.config");
const appointment_model_1 = require("../models/appointment.model");
const Singleton_1 = require("../utils/Singleton");
class AppointmentSequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.appointmentModel = appointment_model_1.Appointment;
        this.createAppointment = async (isoDatesReserved, spaceId, userId) => {
            // use space id and check if space is available
            return this.model.create({ isoDatesReserved, spaceId, userId });
        };
        this.checkAvailability = async (isoDatesToReserve) => {
            const appointment = await this.model.findOne({
                where: {
                    [sequelize_1.Op.or]: [
                        {
                            isoDatesReserved: {
                                [sequelize_1.Op.contains]: isoDatesToReserve,
                            },
                        },
                        {
                            isoDatesReserved: {
                                [sequelize_1.Op.contained]: isoDatesToReserve,
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
    get model() {
        return this.appointmentModel;
    }
}
exports.AppointmentSequelizeDao = AppointmentSequelizeDao;
exports.appointmentSequelizeDao = Singleton_1.SingletonFactory.produce(AppointmentSequelizeDao);
//# sourceMappingURL=appointment.sequelize.dao.js.map