import { Dao } from '../configurations/dao.config';
import { ISpaceCreate, Space, ISpaceEdit, spaceEditFields } from '../models/space.model';
import { QuerySortDirection } from '../types/enums';
import { SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { applicationInstance } from '../App';

interface IQueryString {
    page?: string | number;
    limit?: string | number;
    sortBy?: SpaceQuerySortFields;
    priceRange?: string | string[] | number[];
    datesToReserveQuery?: string | string[]; // '2020-03-14, 2020-03-18'
    timesToReserveQuery?: string | string[];
    cityId?: string;
}
interface IPriceRange {
    from: number;
    to?: number;
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
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    get model(): typeof Space {
        return this.spaceModel;
    }

    // NOTE аутентификация - протекция роута (только для авторизованных пользователей)
    public provideSpace = async (data: ISpaceCreate, files: Express.Multer.File[]): Promise<Space> => {
        try {
            return await this.model.create(data);
        } catch (err) {
            await Promise.all(
                files.map(async (file) => {
                    await this.utilFunctions.findAndRemoveImage(data.userId, file.filename);
                })
            );

            throw err;
        }
    };

    public getSpacesByQuery = async (queryStr: IQueryString): Promise<any> => {
        let { page, limit, sortBy, datesToReserveQuery, timesToReserveQuery, cityId, priceRange } = queryStr;
        let isoDatesRange: string;
        let pricesFromAndTo: IPriceRange;

        if (datesToReserveQuery) {
            datesToReserveQuery = (datesToReserveQuery as string).split(',');
            timesToReserveQuery = timesToReserveQuery ? (timesToReserveQuery as string).split(',') : ['14:00', '12:00'];

            isoDatesRange = UtilFunctions.createIsoDatesRangeToFindAppointments(
                datesToReserveQuery[0],
                timesToReserveQuery[0],
                datesToReserveQuery[1],
                timesToReserveQuery[1]
            );
        }

        /* 
        
        priceRange - если нет, то from должно быть от 0 - либо его вообще может не быть.
        но также может не быть to - как тогда быть ?
        
        */

        if (priceRange) {
            priceRange = (priceRange as string).split(',');
            priceRange = priceRange.map((price: string) => parseInt(price, 10)) as number[];

            if (priceRange.length === 2) {
                pricesFromAndTo = {
                    from: priceRange[0],
                    to: priceRange[1],
                };
            } else {
                pricesFromAndTo = {
                    from: priceRange[0],
                };
            }
        }

        page = page ? (page as number) * 1 : 1;
        limit = limit ? (limit as number) * 1 : 20;

        const offset = (page - 1) * limit;
        const order = sortBy
            ? this.defineSortOrder(sortBy)
            : `"${SpaceSortFields.DATE_OF_CREATION}" ${QuerySortDirection.DESC}`;
        const queryFromParts = this.spacesQueryGeneratorByParts(
            order,
            limit,
            offset,
            isoDatesRange,
            cityId,
            pricesFromAndTo
        );

        return this.utilFunctions.createSequelizeRawQuery(applicationInstance.sequelize, queryFromParts);
    };

    public getUserSpaces = async (userId: string): Promise<Space[]> => {
        return this.model.findAll({
            where: {
                userId,
            },
        });
    };

    public editSpaceById = async (spaceId: string, spaceEditData: ISpaceEdit): Promise<void> => {
        const space = await this.model.findOne({ where: { id: spaceId } });

        await space.update(spaceEditData, { fields: spaceEditFields });
    };

    public deleteSpaceById = async (spaceId: string): Promise<void> => {
        const space = await this.model.findOne({ where: { id: spaceId } });

        await space.destroy();
    };

    public updateSpaceImagesInDb = async (spaceId: string, spaceImagesUrl: string[]): Promise<void> => {
        const spaceImagesUrlJoined: string = spaceImagesUrl.join(', ');
        // NOTE SELECT array_cat(ARRAY[1,2,3], ARRAY[4,5]);
        const updateRawQuery = `UPDATE "Spaces" SET "imagesUrl" = ARRAY_CAT("imagesUrl", '{${spaceImagesUrlJoined}}') WHERE id = '${spaceId}';`;

        await this.utilFunctions.createSequelizeRawQuery(applicationInstance.sequelize, updateRawQuery);
    };

    public removeSpaceImagesFromDb = async (spaceId: string, spaceImagesToDelete: string[]) => {
        let rawRemoveQueries = '';

        spaceImagesToDelete.forEach((spaceImageToDelete: string) => {
            rawRemoveQueries += `UPDATE "Spaces" SET "imagesUrl" = ARRAY_REMOVE("imagesUrl", '${spaceImageToDelete}') WHERE id = '${spaceId}';`;
        });

        await this.utilFunctions.createSequelizeRawQuery(applicationInstance.sequelize, rawRemoveQueries);
    };

    private defineSortOrder = (sortBy: SpaceQuerySortFields): string => {
        switch (sortBy) {
            case SpaceQuerySortFields.PRICEUP:
                return `"${SpaceSortFields.PRICE}" ${QuerySortDirection.ASC}`;

            case SpaceQuerySortFields.PRICEDOWN:
                return `"${SpaceSortFields.PRICE}" ${QuerySortDirection.DESC}`;

            case SpaceQuerySortFields.NEWEST:
                return `"${SpaceSortFields.DATE_OF_CREATION}" ${QuerySortDirection.DESC}`;

            case SpaceQuerySortFields.OLDEST:
                return `"${SpaceSortFields.DATE_OF_CREATION}" ${QuerySortDirection.ASC}`;
        }
    };

    private spacesQueryGeneratorByParts = (
        order: string,
        limit: number,
        offset: number,
        isoDatesRange?: string,
        cityId?: string,
        priceRange?: IPriceRange
    ): string => {
        // NOTE 1. we can use separate functions  2. при отсутствии datesToReservePartialQuery возможна ошибка т.к. будет отсутствовать WHERE constraint. хотя тест проходит
        const cityPartialQuery = cityId ? `AND c."cityId" = ${cityId}` : '';
        const datesToReservePartialQuery = isoDatesRange
            ? `WHERE NOT EXISTS
        (SELECT 1 FROM "Appointments" a WHERE a."spaceId" = s."id"
        AND a."isoDatesReserved" && '${isoDatesRange}')`
            : '';
        const priceRangeFromPartialQuery =
            priceRange && priceRange.from !== undefined ? `AND s."pricePerNight" >= ${priceRange.from}` : '';
        const priceRangeToPartialQuery =
            priceRange && priceRange.to !== undefined ? `AND s."pricePerNight" <= ${priceRange.to}` : '';

        return `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", "regionId", name FROM "Cities") c ON s."cityId" = c."cityId" ${cityPartialQuery} ${datesToReservePartialQuery} ${priceRangeFromPartialQuery} ${priceRangeToPartialQuery} ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;
    };
}

export const spaceSequelizeDao = SingletonFactory.produce<SpaceSequelizeDao>(SpaceSequelizeDao);
