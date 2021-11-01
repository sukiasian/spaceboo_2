import { Includeable } from 'sequelize';
import { FindOptions, Op } from 'sequelize';
import * as sequelize from 'sequelize';
import { Dao } from '../configurations/dao.config';
import { Appointment } from '../models/appointment.model';
import { City } from '../models/city.model';
import { ISpaceCreate, Space, ISpaceEdit } from '../models/space.model';
import { QuerySortDirection } from '../types/enums';
import { SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { citySequelizeDao, CitySequelizeDao } from './city.sequelize.dao';
import { applicationInstance } from '../App';
import { Sequelize } from 'sequelize-typescript';

interface IQueryString {
    page?: string | number;
    limit?: string | number;
    sortBy?: SpaceQuerySortFields;
    datesToReserveQuery?: string | string[]; // '2020-03-14, 2020-03-18'
    timesToReserveQuery?: string | string[];
    cityId?: string;
}
export enum SpaceQuerySortFields {
    PRICEUP = 'priceup',
    PRICEDOWN = 'pricedown',
    OLDEST = 'oldest',
    NEWEST = 'newest',
}
enum SpaceSortFields {
    PRICE = 'pricePerNight',
    DATE_OF_CREATION = 'createdAt',
}

export class SpaceSequelizeDao extends Dao {
    private readonly spaceModel: typeof Space = Space;
    private readonly cityModel: typeof City = City;
    private readonly appointmentModel: typeof Appointment = Appointment;
    private readonly cityDao: CitySequelizeDao = citySequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    get model(): typeof Space {
        return this.spaceModel;
    }

    // NOTE аутентификация - протекция роута (только для авторизованных пользователей)
    public createSpace = async (data: ISpaceCreate): Promise<Space> => {
        return this.model.create(data);
    };

    public getSpacesByQuery = async (queryStr: IQueryString): Promise<any> => {
        try {
            let { page, limit, sortBy, datesToReserveQuery, timesToReserveQuery, cityId } = queryStr;
            let isoDatesRange: string;

            if (datesToReserveQuery) {
                datesToReserveQuery = (datesToReserveQuery as string).split(',');
                timesToReserveQuery = (timesToReserveQuery as string).split(',');

                isoDatesRange = UtilFunctions.createIsoDatesRangeToFindAppointments(
                    datesToReserveQuery[0],
                    timesToReserveQuery[0],
                    datesToReserveQuery[1],
                    timesToReserveQuery[1]
                );
            }

            page = page ? (page as number) * 1 : 1;
            limit = limit ? (limit as number) * 1 : 20;

            const offset = (page - 1) * limit;
            const order = sortBy
                ? this.defineSortOrder(sortBy)
                : `"${SpaceSortFields.DATE_OF_CREATION}" ${QuerySortDirection.DESC}`;
            let spacesRawQuery = `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", city, city_type, timezone, region, region_type, supports_locker FROM "Cities") c ON s."cityId" = c."cityId" ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;

            // NOTE horrible architecture
            if (datesToReserveQuery && !cityId) {
                spacesRawQuery = `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", city, city_type, timezone, region, region_type, supports_locker FROM "Cities") c ON s."cityId" = c."cityId" WHERE NOT EXISTS
                (SELECT 1 FROM "Appointments" a WHERE a."spaceId" = s."id"
                AND a."isoDatesReserved" && '${isoDatesRange}') ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;
            }
            if (cityId && !datesToReserveQuery) {
                spacesRawQuery = `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", city, city_type, timezone, region, region_type, supports_locker FROM "Cities") c ON s."cityId" = c."cityId" AND c."cityId" = ${cityId} ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;
            }
            if (datesToReserveQuery && cityId) {
                spacesRawQuery = `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", city, city_type, timezone, region, region_type, supports_locker FROM "Cities") c ON s."cityId" = c."cityId" AND c."cityId" = ${cityId} WHERE NOT EXISTS
                (SELECT 1 FROM "Appointments" a WHERE a."spaceId" = s."id"
                AND a."isoDatesReserved" && '${isoDatesRange}') ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;
            }

            const spaces = await this.utilFunctions.createSequelizeRawQuery(
                applicationInstance.sequelize,
                spacesRawQuery
            );

            return spaces;
        } catch (err) {
            console.log(err, 'errrrrrr');
        }
    };

    // NOTE аутентификация
    public editSpaceById = async (spaceId: string, userId: string, data: ISpaceEdit) => {
        const space = (await this.findById(spaceId, true)) as Space;
        await space.update(data);
    };

    // NOTE аутентификация и проверка на то что
    public deleteSpaceById = async () => {};

    private defineSortOrder = (sortBy: SpaceQuerySortFields): string => {
        switch (sortBy) {
            case SpaceQuerySortFields.PRICEUP:
                return `"${SpaceSortFields.PRICE}" ${QuerySortDirection.ASC}`;

            case SpaceQuerySortFields.PRICEDOWN:
                return `"${SpaceSortFields.PRICE}" ${QuerySortDirection.DESC}`;

            case SpaceQuerySortFields.NEWEST:
                return `"${SpaceSortFields.DATE_OF_CREATION}" ${QuerySortDirection.ASC}`;

            case SpaceQuerySortFields.OLDEST:
                return `"${SpaceSortFields.DATE_OF_CREATION}" ${QuerySortDirection.DESC}`;
        }
    };
}

export const spaceSequelizeDao = SingletonFactory.produce<SpaceSequelizeDao>(SpaceSequelizeDao);
