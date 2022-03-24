import { Dao } from '../configurations/dao.config';
import { ISpaceCreate, Space, ISpaceEdit, spaceEditFields, ISpace } from '../models/space.model';
import { QuerySortDirection } from '../types/enums';
import { SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { appConfig } from '../AppConfig';
import { Appointment, IAppointment } from '../models/appointment.model';
import { City } from '../models/city.model';

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
            await this.findUploadedImagesAndRemove(data.userId, files);

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

        // NOTE priceRange - если нет, то from должно быть от 0 - либо его вообще может не быть. но также может не быть to - как тогда быть ?

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

        return this.utilFunctions.createSequelizeRawQuery(appConfig.sequelize, queryFromParts);
    };

    public getSpaceById = async (spaceId: string): Promise<Space> => {
        return this.model.findOne({
            where: {
                id: spaceId,
            },
            include: [City],
        });
    };

    public getUserSpaces = async (userId: string): Promise<Space[]> => {
        return this.model.findAll({
            where: {
                userId,
            },
        });
    };

    public getSpacesForUserOutdatedAppointmentsIds = async (userId: string): Promise<ISpace[]> => {
        const now = new Date().toISOString();
        const getOutdatedAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND UPPER(a."isoDatesReserved") < '${now}';`;
        const userOutdatedAppointments = (await this.utilFunctions.createSequelizeRawQuery(
            appConfig.sequelize,
            getOutdatedAppointmentsRawQuery
        )) as IAppointment[];
        const spacesForUserOutdatedAppointments = await Promise.all(
            userOutdatedAppointments.map(async (appointment) => {
                const getSpaceForUserOutdatedAppointment = `SELECT * FROM "Appointments" a JOIN "Spaces" s ON a."spaceId" = s."id" WHERE a."id" = '${appointment.id}';`;

                return this.utilFunctions.createSequelizeRawQuery(
                    appConfig.sequelize,
                    getSpaceForUserOutdatedAppointment,
                    { plain: true }
                );
            })
        );

        return spacesForUserOutdatedAppointments as ISpace[];
    };

    public getSpacesForUserActiveAppointmentsIds = async (userId: string): Promise<ISpace[]> => {
        const now = new Date().toISOString();
        const getActiveAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND a."isoDatesReserved" @> '${now}'::timestamptz;`;
        const userActiveAppointments = (await this.utilFunctions.createSequelizeRawQuery(
            appConfig.sequelize,
            getActiveAppointmentsRawQuery
        )) as IAppointment[];
        const spacesForUserActiveAppointments = await Promise.all(
            userActiveAppointments.map(this.getSpaceByAppointment)
        );

        return spacesForUserActiveAppointments as ISpace[];
    };

    public getSpacesForUserUpcomingAppointmentsIds = async (userId: string): Promise<ISpace[]> => {
        const now = new Date().toISOString();
        const getUpcomingAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND LOWER(a."isoDatesReserved") > '${now}';`;
        const userUpcomingAppointments = (await this.utilFunctions.createSequelizeRawQuery(
            appConfig.sequelize,
            getUpcomingAppointmentsRawQuery
        )) as IAppointment[];
        const spacesForUserUpcomingAppointments = await Promise.all(
            userUpcomingAppointments.map(this.getSpaceByAppointment)
        );

        return spacesForUserUpcomingAppointments;
    };

    private getSpaceByAppointment = async (appointment: IAppointment): Promise<ISpace> => {
        const getSpaceForUserOutdatedAppointment = `SELECT * FROM "Appointments" a JOIN "Spaces" s ON a."spaceId" = s."id" WHERE a."id" = '${appointment.id}';`;

        return (await this.utilFunctions.createSequelizeRawQuery(
            appConfig.sequelize,
            getSpaceForUserOutdatedAppointment,
            { plain: true }
        )) as ISpace;
    };

    public getSpacesForKeyControl = async (userId: string): Promise<ISpace[]> => {
        const now = new Date().toISOString();
        const getUserActiveAppointmentsForLockConnectedSpacesRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND "lockerConnected" = 'true' AND a."isoDatesReserved" @> '${now}'::timestamptz;`;
        const userActiveAppointments = (await this.utilFunctions.createSequelizeRawQuery(
            appConfig.sequelize,
            getUserActiveAppointmentsForLockConnectedSpacesRawQuery
        )) as IAppointment[];
        const spacesForUserActiveAppointments = await Promise.all(
            userActiveAppointments.map(this.getSpaceByAppointment)
        );

        return spacesForUserActiveAppointments;
    };

    public editSpaceById = async (
        userId: string,
        spaceId: string,
        spaceEditData: ISpaceEdit,
        files: Express.Multer.File[]
    ): Promise<void> => {
        try {
            const space = await this.model.findOne({ where: { id: spaceId } });

            await space.update(spaceEditData, { fields: spaceEditFields });
        } catch (err) {
            await this.findUploadedImagesAndRemove(userId, files);

            throw err;
        }
    };

    public deleteSpaceById = async (spaceId: string): Promise<void> => {
        const space = await this.model.findOne({ where: { id: spaceId } });

        await space.destroy();
    };

    public updateSpaceImagesInDb = async (
        userId: string,
        spaceId: string,
        spaceImagesToRemove: string[],
        uploadedFiles: Express.Multer.File[]
    ): Promise<void> => {
        // NOTE SELECT array_cat(ARRAY[1,2,3], ARRAY[4,5]);
        const actualSpaceImagesUrls = ((await this.findById(spaceId)) as Space).imagesUrl || [];
        let spaceImagesUrlsAfterRemoval: string[] = actualSpaceImagesUrls;

        for (const spaceImageToRemove of spaceImagesToRemove) {
            spaceImagesUrlsAfterRemoval = spaceImagesUrlsAfterRemoval.filter((el) => el !== spaceImageToRemove);
        }

        const spaceImagesToAddUrls = uploadedFiles.map((file: Express.Multer.File) => {
            return `${userId}/${file.filename}`;
        }) as string[];
        const newSpaceImagesUrlsFromRemainingAndNewOnes = [...spaceImagesUrlsAfterRemoval, ...spaceImagesToAddUrls];
        const newSpaceImagesUrlsFromRemainingAndNewOnesJoined = newSpaceImagesUrlsFromRemainingAndNewOnes.join(', ');
        const updateRawQuery = `UPDATE "Spaces" SET "imagesUrl" = ARRAY_CAT("imagesUrl", '{${newSpaceImagesUrlsFromRemainingAndNewOnesJoined}}') WHERE id = '${spaceId}';`;

        await this.utilFunctions.createSequelizeRawQuery(appConfig.sequelize, updateRawQuery);
    };

    public removeSpaceImagesFromDb = async (spaceId: string, spaceImagesToDelete: string[]) => {
        let rawRemoveQueries = '';

        spaceImagesToDelete.forEach((spaceImageToDelete: string) => {
            rawRemoveQueries += `UPDATE "Spaces" SET "imagesUrl" = ARRAY_REMOVE("imagesUrl", '${spaceImageToDelete}') WHERE id = '${spaceId}';`;
        });

        await this.utilFunctions.createSequelizeRawQuery(appConfig.sequelize, rawRemoveQueries);
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

    private findUploadedImagesAndRemove = (userId: string, files: Express.Multer.File[]): Promise<void[]> => {
        return Promise.all(
            files.map(async (file) => {
                await this.utilFunctions.findAndRemoveImage(userId, file.filename);
            })
        );
    };
}

export const spaceSequelizeDao = SingletonFactory.produce<SpaceSequelizeDao>(SpaceSequelizeDao);
