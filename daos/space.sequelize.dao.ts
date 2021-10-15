import { FindOptions, Op } from 'sequelize';
import { Dao } from '../configurations/dao.config';
import { Appointment } from '../models/appointment.model';
import { City } from '../models/city.model';
import { ISpaceCreate, SpaceQuerySorting, Space, ISpaceEdit } from '../models/space.model';
import { QuerySortDirection } from '../types/enums';
import { SingletonFactory } from '../utils/Singleton';

interface IQueryString {
    page?: string | number;
    limit?: string | number;
    sortBy?: SpaceQuerySortFields;
    datesToReserve?: string | number;
    city?: string;
}
enum SpaceQuerySortFields {
    PRICEUP = 'priceup',
    PRICEDOWN = 'pricedown',
    OLDEST = 'oldest',
    NEWEST = 'newest',
}
enum SpaceSortFields {
    PRICE = 'price',
    DATE_OF_CREATION = 'dateOfCreation',
}

export class SpaceSequelizeDao extends Dao {
    private readonly spaceModel: typeof Space = Space;

    get model(): typeof Space {
        return this.spaceModel;
    }

    // NOTE аутентификация - протекция роута (только для авторизованных пользователей)
    createSpace = async (data: ISpaceCreate): Promise<Space> => {
        return this.model.create(data);
    };

    getSpacesByQuery = async (queryStr: IQueryString): Promise<Space[]> => {
        console.log(111111111);
        let { page, limit, sortBy, datesToReserve, city } = queryStr;
        console.log(222222222);
        page = (page as number) * 1;
        limit = (limit as number) * 1;
        const offset = (page - 1) * limit + 1;

        // NOTE нужен парсинг дат чтобы потом положить отпарсенные данные в where
        // NOTE поле order - нужна функция которая сама определяет значение
        const query: FindOptions = {
            order: sortBy
                ? [this.defineSortOrder(sortBy)]
                : [SpaceQuerySorting.DATE_OF_CREATION, QuerySortDirection.DESC],
            limit: limit || 20,
            offset: offset || 0,
            include: [{ all: true }],
        };

        if (datesToReserve || city) {
            // datesToReserve должно не быть среди appointments
            /* 
                where 
                    datesToReserve <@ ['appointments.datesReserved'], 
                    datesToReserve @> ['appointments.datesReserved'] 
            */
            const datesToReserveQuery = {
                datesReserved: {
                    [Op.contains]: [datesToReserve],
                },
                [Op.or]: {
                    datesReserved: {
                        [Op.contained]: [datesToReserve],
                    },
                },
            };
            const cityQuery = {
                ['city.city']: city,
            };

            query.where = datesToReserve ? { ...datesToReserveQuery } : null;
            query.where = city ? { ...cityQuery } : null;
            query.where = datesToReserve && city ? { ...datesToReserveQuery, ...cityQuery } : null;
        }

        return this.model.findAll(query);
    };

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

    private parseDates = (): any => {};
}

export const spaceSequelizeDao = SingletonFactory.produce<SpaceSequelizeDao>(SpaceSequelizeDao);
