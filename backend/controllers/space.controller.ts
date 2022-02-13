import { Singleton, SingletonFactory } from '../utils/Singleton';
import { spaceSequelizeDao, SpaceSequelizeDao } from '../daos/space.sequelize.dao';
import UtilFunctions from '../utils/UtilFunctions';
import { ErrorMessages, HttpStatus, ResponseMessages } from '../types/enums';
import AppError from '../utils/AppError';

export class SpaceController extends Singleton {
    private readonly dao: SpaceSequelizeDao = spaceSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public provideSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;

        if (req.files.length === 0) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.SPACE_IMAGES_ARE_NOT_PROVIDED);
        }

        const space = await this.dao.provideSpace({ ...req.body, userId }, req.files);

        res.locals.spaceId = space.id;

        this.utilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.SPACE_PROVIDED, space);

        next();
    });

    public getSpaceById = this.utilFunctions.catchAsync(async (req, res, next) => {
        const space = await this.dao.findById(req.params.spaceId);

        if (!space) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.SPACE_NOT_FOUND);
        }

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, space);
    });

    // TODO pagination, limitation, sorting продумать логику как это будет работать
    public getSpacesByQuery = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const spaces = await this.dao.getSpacesByQuery(req.query);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, spaces);
    });

    public getSpacesByUserId = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        // использовать jwt guard, затем обратиться к юзеру
        const spaces = await this.dao.getUserSpaces(req.user.id);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, spaces);
    });

    public editSpaceById = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { spaceId } = req.params;
        const { spaceEditData } = req.body;

        await this.dao.editSpaceById(spaceId, spaceEditData);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.DATA_UPDATED);
    });

    public deleteSpaceById = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { spaceId } = req.params;

        await this.dao.deleteSpaceById(spaceId);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.SPACE_DELETED);
    });
}

// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
export const spaceController = SingletonFactory.produce<SpaceController>(SpaceController);
