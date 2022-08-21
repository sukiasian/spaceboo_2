import { Singleton, SingletonFactory } from '../utils/Singleton';
import { spaceSequelizeDao, SpaceSequelizeDao } from '../daos/space.sequelize.dao';
import UtilFunctions from '../utils/UtilFunctions';
import { Environment, ErrorMessages, HttpStatus, RedisVariable, ResponseMessages } from '../types/enums';
import AppError from '../utils/AppError';
import { redis } from '../Redis';

export class SpaceController extends Singleton {
    private readonly dao: SpaceSequelizeDao = spaceSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;
    private readonly redisClient = redis.client;
    private readonly createSpaceAttemptsPerDay = '4';

    public provideSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;

        if (!req.files || req.files.length === 0) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.SPACE_IMAGES_ARE_NOT_PROVIDED);
        }

        if (!req.body.cityId) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.PICK_CITY_FROM_THE_LIST);
        }

        const space = await this.dao.provideSpace({ ...req.body, userId }, req.files);

        res.locals.spaceId = space.id;

        this.utilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.SPACE_PROVIDED, space);

        next();
    });

    public getSpaceById = this.utilFunctions.catchAsync(async (req, res, next) => {
        const space = await this.dao.getSpaceById(req.params.spaceId);

        if (!space) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.SPACE_NOT_FOUND);
        }

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, space);
    });

    public getSpacesByQuery = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const spaces = await this.dao.getSpacesByQuery(req.query);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, spaces);
    });

    public getSpacesByUserId = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const spaces = await this.dao.getUserSpaces(req.user.id);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, spaces);
    });

    public getSpacesForUserOutdatedAppointmentsIds = this.utilFunctions.catchAsync(
        async (req, res, next): Promise<void> => {
            const { id: userId } = req.user;
            const spacesForOutdatedAppointments = await this.dao.getSpacesForUserOutdatedAppointmentsIds(userId);

            this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, spacesForOutdatedAppointments);
        }
    );

    public getSpacesForUserActiveAppointmentsIds = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;
        const spacesForActiveAppointments = await this.dao.getSpacesForUserActiveAppointmentsIds(userId);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, spacesForActiveAppointments);
    });

    public getSpacesForUserUpcomingAppointmentsIds = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;
        const spacesForUpcomingAppointments = await this.dao.getSpacesForUserUpcomingAppointmentsIds(userId);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, spacesForUpcomingAppointments);
    });

    public getSpacesForKeyControl = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;
        const spacesForKeyControl = await this.dao.getSpacesForKeyControl(userId);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, spacesForKeyControl);
    });

    public editSpaceById = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: userId } = req.user;
        const { spaceId } = req.params;
        const { spaceEditData } = req.body;

        await this.dao.editSpaceById(userId, spaceId, spaceEditData, req.files);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.DATA_UPDATED);

        next();
    });

    public deleteSpaceById = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { spaceId } = req.params;

        await this.dao.deleteSpaceById(spaceId);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.SPACE_DELETED);
    });

    public checkAttempts = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: userId } = req.user;

        const createSpaceAttemptsKey = `${RedisVariable.CREATE_SPACE_ATTEMPTS}:${userId}`;
        const createSpaceAttemptsValue = await this.redisClient.get(createSpaceAttemptsKey);

        if (createSpaceAttemptsValue === null) {
            await this.redisClient.set(createSpaceAttemptsKey, '1');
        } else if (createSpaceAttemptsValue === this.createSpaceAttemptsPerDay) {
            await this.redisClient.setEx(
                createSpaceAttemptsKey,
                process.env.NODE_ENV === Environment.DEVELOPMENT ? 10 : 60 * 60 * 24,
                this.createSpaceAttemptsPerDay
            );

            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.CREATE_SPACE_LIMIT_EXCEEDED);
        } else {
            await this.redisClient.set(
                createSpaceAttemptsKey,
                `${this.utilFunctions.makeDecimal(createSpaceAttemptsValue) + 1}`
            );
        }

        next();
    });
}

// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
export const spaceController = SingletonFactory.produce<SpaceController>(SpaceController);
