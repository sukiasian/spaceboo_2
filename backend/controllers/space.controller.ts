import { Singleton, SingletonFactory } from '../utils/Singleton';
import { spaceSequelizeDao, SpaceSequelizeDao } from '../daos/space.sequelize.dao';
import UtilFunctions from '../utils/UtilFunctions';
import { HttpStatus, ResponseMessages } from '../types/enums';

export class SpaceController extends Singleton {
    private readonly dao: SpaceSequelizeDao = spaceSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public provideSpace = UtilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;
        const space = await this.dao.provideSpace({ ...req.body, userId });

        req.space = space;

        next();
    });

    public sendProvideSpaceResponse = this.utilFunctions.catchAsync(async (req, res, next) => {
        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.SPACE_PROVIDED, req.space);
    });

    public getSpaceById = UtilFunctions.catchAsync(async (req, res, next) => {
        const space = await this.dao.findById(req.params.id);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, space);
    });

    // TODO pagination, limitation, sorting продумать логику как это будет работать
    public getSpacesByQuery = UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const spaces = await this.dao.getSpacesByQuery(req.query);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, spaces);
    });

    public editSpaceById = UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { spaceId } = req.params;
        const { spaceEditData } = req.body;

        await this.dao.editSpaceById(spaceId, spaceEditData);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.DATA_UPDATED);
    });

    public deleteSpaceById = UtilFunctions.catchAsync(async (req, res, next) => {
        const { spaceId } = req.params;

        await this.dao.deleteSpaceById(spaceId);
        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.SPACE_DELETED);
    });
}

// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
export const spaceController = SingletonFactory.produce<SpaceController>(SpaceController);
