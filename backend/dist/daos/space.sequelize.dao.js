"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceSequelizeDao = exports.SpaceSequelizeDao = void 0;
const sequelize_1 = require("sequelize");
const dao_config_1 = require("../configurations/dao.config");
const appointment_model_1 = require("../models/appointment.model");
const city_model_1 = require("../models/city.model");
const space_model_1 = require("../models/space.model");
const enums_1 = require("../types/enums");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const city_sequelize_dao_1 = require("./city.sequelize.dao");
const sequelize = require("sequelize");
var SpaceQuerySortFields;
(function (SpaceQuerySortFields) {
    SpaceQuerySortFields["PRICEUP"] = "priceup";
    SpaceQuerySortFields["PRICEDOWN"] = "pricedown";
    SpaceQuerySortFields["OLDEST"] = "oldest";
    SpaceQuerySortFields["NEWEST"] = "newest";
})(SpaceQuerySortFields || (SpaceQuerySortFields = {}));
var SpaceSortFields;
(function (SpaceSortFields) {
    SpaceSortFields["PRICE"] = "price";
    SpaceSortFields["DATE_OF_CREATION"] = "createdAt";
})(SpaceSortFields || (SpaceSortFields = {}));
class SpaceSequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.spaceModel = space_model_1.Space;
        this.cityModel = city_model_1.City;
        this.appointmentModel = appointment_model_1.Appointment;
        this.cityDao = city_sequelize_dao_1.citySequelizeDao;
        // NOTE аутентификация - протекция роута (только для авторизованных пользователей)
        this.createSpace = async (data) => {
            return this.model.create(data);
        };
        this.getSpacesByQuery = async (queryStr) => {
            try {
                let { page, limit, sortBy, datesToReserveQuery, timesToReserveQuery, city } = queryStr;
                let isoDatesRange;
                page = page ? page * 1 : undefined;
                limit = limit ? limit * 1 : undefined;
                if (datesToReserveQuery && timesToReserveQuery) {
                    datesToReserveQuery = datesToReserveQuery.split(',');
                    timesToReserveQuery = timesToReserveQuery.split(',');
                    isoDatesRange = UtilFunctions_1.default.createIsoDatesRangeToFindAppointments(datesToReserveQuery[0], timesToReserveQuery[0], datesToReserveQuery[1], timesToReserveQuery[1]);
                }
                const offset = (page - 1) * limit + 1;
                const query = {
                    order: sortBy
                        ? [this.defineSortOrder(sortBy)]
                        : [[SpaceSortFields.DATE_OF_CREATION, enums_1.QuerySortDirection.DESC]],
                    limit: limit || 20,
                    offset: offset || 0,
                    nest: true,
                    include: [],
                };
                let cityIncludable;
                let appointmentsIncludable;
                if (city) {
                    cityIncludable = {
                        model: this.cityModel,
                        required: true,
                        where: {
                            city,
                        },
                    };
                    query.include.push(cityIncludable);
                }
                if (datesToReserveQuery) {
                    // appointmentsIncludable = {
                    //     model: Appointment,
                    //     as: 'appointments',
                    //     // required: false,
                    //     // duplicating: true,
                    //     // @ts-ignore
                    //     // where: {
                    //     // isoDatesReserved: {
                    //     //     [Op.overlap]: sequelize.cast(isoDatesRange, 'tstzrange'),
                    //     // },
                    //     // },
                    // };
                    // (query.include as Includeable[]).push(appointmentsIncludable);
                }
                const spaces = await this.model.findAll({
                    include: [{ model: appointment_model_1.Appointment, required: true }, city_model_1.City],
                    where: {
                        // @ts-ignore
                        [sequelize_1.Op.not]: {
                            ['$appointments.isoDatesReserved$']: {
                                [sequelize_1.Op.overlap]: sequelize.cast(isoDatesRange, 'tstzrange'),
                            },
                        },
                    },
                });
                return spaces;
            }
            catch (err) {
                console.log(err, 'errrrrr');
            }
        };
        // NOTE аутентификация
        this.editSpaceById = async (spaceId, userId, data) => {
            const space = (await this.findById(spaceId, true));
            await space.update(data);
        };
        // NOTE аутентификация и проверка на то что
        this.deleteSpaceById = async () => { };
        this.defineSortOrder = (sortBy) => {
            switch (sortBy) {
                case SpaceQuerySortFields.PRICEUP:
                    return [SpaceSortFields.PRICE, enums_1.QuerySortDirection.ASC];
                case SpaceQuerySortFields.PRICEDOWN:
                    return [SpaceSortFields.PRICE, enums_1.QuerySortDirection.DESC];
                case SpaceQuerySortFields.NEWEST:
                    return [SpaceSortFields.DATE_OF_CREATION, enums_1.QuerySortDirection.ASC];
                case SpaceQuerySortFields.OLDEST:
                    return [SpaceSortFields.DATE_OF_CREATION, enums_1.QuerySortDirection.DESC];
            }
        };
        // private datesToReserveQueryParser = (datesToReserveQuery: string): TDatesReserved => {
        //     const datesToReserve: string[] = datesToReserveQuery.split(',');
        // };
    }
    get model() {
        return this.spaceModel;
    }
}
exports.SpaceSequelizeDao = SpaceSequelizeDao;
exports.spaceSequelizeDao = Singleton_1.SingletonFactory.produce(SpaceSequelizeDao);
/*

Решение смотреть выше:

сначала мы находим все спейсы которые есть (но что делать с лимитацией  и пагинацией?) на каждую страницу отправлять новый запрос и выполнять query
- выдавая в качестве response-а каждую последующую двадцатку результатов, соответствующих времени.

NOTE возможно то что мы прописали это дорогая операция, поэтому если сити предопределен в queryStr, то лучше тогда
задать отдельную логику. Это вариант один.
Вариант второй, как мы делали до этого , использовать переменную query, и  если city определен
то query.city = { where: { city }}. Минус этого подхода в том что нам придется проворачивать крайне дорогую операцию -
лучше этого избежать.
Также,у нас есть 2  условия выше - это if datesToReserve === true и city === true. С этим тоже нужно что то
сделать чтобы упростить код.

Последний момент - нам нужно улучшить все парсеры и проработать условия. Код будет работать.
*/
//# sourceMappingURL=space.sequelize.dao.js.map