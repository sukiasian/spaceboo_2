import { WhereAttributeHash, WhereOperators, WhereOptions } from 'sequelize';
import { FindOptions, Op } from 'sequelize';
import { Dao } from '../configurations/dao.config';
import { Appointment, TIsoDatesToFindAppointments, TIsoDatesReserved } from '../models/appointment.model';
import { City } from '../models/city.model';
import { ISpaceCreate, Space, ISpaceEdit } from '../models/space.model';
import { QuerySortDirection } from '../types/enums';
import { SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { citySequelizeDao, CitySequelizeDao } from './city.sequelize.dao';
import * as sequelize from 'sequelize';
import { DataType } from 'sequelize-typescript';

interface IQueryString {
    page?: string | number;
    limit?: string | number;
    sortBy?: SpaceQuerySortFields;
    datesToReserve?: string | string[]; // '2020-03-14, 2020-03-18'
    timesToReserve?: string | string[];
    city?: number;
}
enum SpaceQuerySortFields {
    PRICEUP = 'priceup',
    PRICEDOWN = 'pricedown',
    OLDEST = 'oldest',
    NEWEST = 'newest',
}
enum SpaceSortFields {
    PRICE = 'price',
    DATE_OF_CREATION = 'createdAt',
}

export class SpaceSequelizeDao extends Dao {
    private readonly spaceModel: typeof Space = Space;
    private readonly cityModel: typeof City = City;
    private readonly cityDao: CitySequelizeDao = citySequelizeDao;

    get model(): typeof Space {
        return this.spaceModel;
    }

    // NOTE аутентификация - протекция роута (только для авторизованных пользователей)
    createSpace = async (data: ISpaceCreate): Promise<Space> => {
        return this.model.create(data);
    };

    getSpacesByQuery = async (queryStr: IQueryString): Promise<Space[]> => {
        try {
            let { page, limit, sortBy, datesToReserve, timesToReserve, city } = queryStr;

            datesToReserve = datesToReserve ? (datesToReserve as string).split(',') : undefined;
            timesToReserve = timesToReserve ? (timesToReserve as string).split(',') : undefined; // NOTE on frontend we need to specify - from 14:00 to 12:00 if timesToReserve is undefined
            page = page ? (page as number) * 1 : undefined;
            limit = limit ? (limit as number) * 1 : undefined;

            const offset = (page - 1) * limit + 1;
            const query: FindOptions = {
                order: sortBy
                    ? [this.defineSortOrder(sortBy)]
                    : [[SpaceSortFields.DATE_OF_CREATION, QuerySortDirection.DESC]],
                limit: limit || 20,
                offset: offset || 0,
                include: [City, Appointment],
            };
            // let isoDatesRangeArr: TIsoDatesToFindAppointments;
            let isoDatesRangeArr: TIsoDatesToFindAppointments;
            console.log(222222);

            if (city) {
                const timezone = (await this.cityModel.findOne({ where: { city } })).timezone;

                query.where = {
                    ['city.city']: city,
                } as WhereAttributeHash<City>; // NOTE may cause troubles

                if (datesToReserve) {
                    isoDatesRangeArr = UtilFunctions.createIsoDatesRangeToFindAppointments(
                        datesToReserve[0],
                        timesToReserve[0],
                        datesToReserve[1],
                        timesToReserve[1],
                        timezone
                    );
                    console.log('hey');

                    const spaces = this.model.findAll({
                        ...query,
                        include: [
                            {
                                model: Appointment,
                            },
                            {
                                model: City,
                            },
                        ],
                    });

                    return spaces;
                }
                const spaces = this.model.findAll({
                    ...query,
                });

                return spaces;
            }

            const allSpaces = await this.model.findAll({
                ...query,
            });
            console.log(333333);

            if (datesToReserve) {
                const spacesFilteredByQuery = await Promise.all(
                    allSpaces.map(async (space) => {
                        // isoDatesRangeArr = UtilFunctions.createIsoDatesRangeToFindAppointments(
                        //     datesToReserve[0],
                        //     timesToReserve[0],
                        //     datesToReserve[1],
                        //     timesToReserve[1],
                        //     space['city']['dataValues']['timezone']
                        // );
                        isoDatesRangeArr = UtilFunctions.createIsoDatesRangeToFindAppointments(
                            datesToReserve[0],
                            timesToReserve[0],
                            datesToReserve[1],
                            timesToReserve[1],
                            space['city']['dataValues']['timezone']
                        );
                        // @ts-ignore
                        return this.model.findOne({
                            ...query,
                            include: [
                                {
                                    model: Appointment,
                                    as: 'appointments',
                                    required: true,
                                    duplicating: false,
                                    // // @ts-ignore
                                    // where: {
                                    // [Op.not]: {
                                    //     [Op.or]: [
                                    //         {
                                    //             isoDatesReserved: {
                                    //                 [Op.contains]: [
                                    //                     '2020-12-15T11:00:01.000Z',
                                    //                     '2020-12-20T08:00:00.000Z',
                                    //                 ],
                                    //             },
                                    //         },
                                    //         {
                                    //             isoDatesReserved: {
                                    //                 [Op.contained]: [
                                    //                     '2020-12-15T11:00:01.000Z',
                                    //                     '2020-12-20T08:00:00.000Z',
                                    //                 ],
                                    //             },
                                    //         },
                                    //     ],
                                    // },
                                    // },
                                },
                                City,
                            ],
                            nest: true,

                            where: {
                                id: space.id,
                                // @ts-ignore
                                [Op.not]: {
                                    ['$appointments.isoDatesReserved$']: {
                                        [Op.overlap]: sequelize.cast(
                                            '[2020-12-15T14:00:00.0+03:00, 2022-12-25T09:00:00.0+03:00)',
                                            'tstzrange'
                                        ),

                                        // [Op.contains]: sequelize.cast(
                                        //     '[2020-12-15T14:00:00.0+03:00, 2020-12-20T12:00:00.0+03:00)',
                                        //     'tstzrange'
                                        // ),
                                        // sequelize.cast('2020-12-20T08:00:00.000Z', 'timestamp'),
                                    },
                                },
                            },
                            // },
                        });
                    })
                );

                return spacesFilteredByQuery;
            }

            return allSpaces;
        } catch (err) {
            console.log(err, 'errrrrr');
        }
    };

    // getSpacesByQuery_2 = async (queryStr: IQueryString): Promise<Space[]> => {
    //     try {
    //         let { page, limit, sortBy, datesToReserve, city } = queryStr;

    //         page = page ? (page as number) * 1 : undefined;
    //         limit = limit ? (limit as number) * 1 : undefined;

    //         const offset = (page - 1) * limit + 1;
    //         const query: FindOptions = {
    //             order: sortBy
    //                 ? [this.defineSortOrder(sortBy)]
    //                 : [SpaceQuerySorting.DATE_OF_CREATION, QuerySortDirection.DESC],
    //             limit: limit || 20,
    //             offset: offset || 0,
    //         };
    //         // const timezone = city ? (await this.cityModel.findOne({ where: { city } })).timezone : null;

    //         // datesToReserve = parse into TDatesReserved
    //         // if (datesToReserve || city) {
    //         //     // datesToReserve должно не быть среди appointments
    //         // const datesToReserveQuery = {
    //         //     where: {
    //         //         [Op.or]: [
    //         //             {
    //         //                 datesReserved: {
    //         //                     [Op.contains]: datesToReserve,
    //         //                 },
    //         //             },
    //         //             {
    //         //                 datesReserved: {
    //         //                     [Op.not]: {
    //         //                         [Op.contained]: datesToReserve,
    //         //                     },
    //         //                 },
    //         //             },
    //         //         ],
    //         //     },
    //         // };
    //         //     const cityQuery = {
    //         //         ['city.city']: city,
    //         //     };

    //         //     query.where = datesToReserve ? { ...datesToReserveQuery } : null;
    //         //     query.where = city ? { ...cityQuery } : null;
    //         //     query.where = datesToReserve && city ? { ...datesToReserveQuery, ...cityQuery } : null;
    //         // }
    //         let datesToReserveQuery: WhereOptions<Appointment> = {};
    //         let cityQuery: WhereOptions<Appointment> = {};
    //         let timezone: string;

    //         datesToReserve = (datesToReserve as string).split(',');

    //         if (city) {
    //             timezone = (await this.cityModel.findOne({ where: { city } })).timezone;

    //             datesToReserve = UtilFunctions.createDatesToReserve(
    //                 datesToReserve[0],
    //                 datesToReserve[1],
    //                 timezone
    //             ) as TDatesReserved;
    //             cityQuery = {
    //                 where: {
    //                     ['city.city']: city,
    //                 },
    //             };
    //         }
    //         if (datesToReserve) {
    //             datesToReserve = UtilFunctions.createDatesToReserve(
    //                 datesToReserve[0],
    //                 datesToReserve[1],
    //                 timezone
    //             ) as TDatesReserved;

    //             datesToReserveQuery = {
    //                 where: {
    //                     [Op.or]: [
    //                         {
    //                             datesReserved: {
    //                                 [Op.contains]: datesToReserve,
    //                             },
    //                         },
    //                         {
    //                             datesReserved: {
    //                                 [Op.contained]: datesToReserve,
    //                             },
    //                         },
    //                     ],
    //                 },
    //             } as WhereAttributeHash<Appointment>;
    //         }
    //         // FIXME убрать city из include
    //         // FIXME устанавливать attributes (fields) для foreign rows
    //         // FIXME нам нужно парсить дату так чтобы datesToReserve соответствовал каждому городу
    //         query.where = { ...datesToReserveQuery, ...cityQuery };

    //         const a = await this.model.findOne({
    //             include: [
    //                 {
    //                     model: Appointment,
    //                     as: 'appointments',
    //                     where: {
    //                         datesReserved: {
    //                             [Op.contained]: ['2020-12-15T03:00:00.000-07:00', '2020-12-21T03:00:00.000+03:00'],
    //                         },
    //                     },
    //                     // {
    //                     //     datesReserved: {
    //                     //         [Op.contains]: ['2020-12-15T03:00:00.000Z', '2023-12-20T03:00:00.000Z'],
    //                     //     },
    //                     // },
    //                     // {
    //                     //     datesReserved: {
    //                     //         [Op.contained]: ['2020-12-15T03:00:00.000Z', '2023-12-15T03:00:00.000Z'],
    //                     //     },
    //                     // },
    //                 },
    //             ],
    //         });

    //         if (city) {
    //             const spaces = await this.model.findAll();

    //             return spaces;
    //         } else {
    //             const allSpaces = await this.model.findAll({ limit, offset }); // Space[]
    //             const spacesFilteredByQuery = allSpaces.map(async (space) => {
    //                 return this.model.findOne({
    //                     include: [
    //                         { model: City, as: 'city' },
    //                         {
    //                             model: Appointment,
    //                             as: 'appointments',
    //                             where: {
    //                                 datesReserved: `${datesToReserve}${space['city.timezone']}`, // plus parse this value
    //                             },
    //                         },
    //                     ],
    //                 });
    //             });

    //             return Promise.all(spacesFilteredByQuery);
    //         }
    //         // return this.model.findAll(query);
    //     } catch (err) {
    //         console.log(err, 'errorrrrrrrr');
    //     }
    // };

    // NOTE аутентификация
    editSpaceById = async (spaceId: string, userId: string, data: ISpaceEdit) => {
        const space = (await this.findById(spaceId, true)) as Space;
        await space.update(data);
    };

    // NOTE аутентификация и проверка на то что
    deleteSpaceById = async () => {};

    private defineSortOrder = (sortBy: SpaceQuerySortFields): [SpaceSortFields, QuerySortDirection] => {
        switch (sortBy) {
            case SpaceQuerySortFields.PRICEUP:
                return [SpaceSortFields.PRICE, QuerySortDirection.ASC];

            case SpaceQuerySortFields.PRICEDOWN:
                return [SpaceSortFields.PRICE, QuerySortDirection.DESC];

            case SpaceQuerySortFields.NEWEST:
                return [SpaceSortFields.DATE_OF_CREATION, QuerySortDirection.ASC];

            case SpaceQuerySortFields.OLDEST:
                return [SpaceSortFields.DATE_OF_CREATION, QuerySortDirection.DESC];
        }
    };

    // private datesToReserveQueryParser = (datesToReserveQuery: string): TDatesReserved => {
    //     const datesToReserve: string[] = datesToReserveQuery.split(',');
    // };
}

export const spaceSequelizeDao = SingletonFactory.produce<SpaceSequelizeDao>(SpaceSequelizeDao);

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
