import * as dotenv from 'dotenv';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { spaceSequelizeDao, SpaceSequelizeDao } from '../daos/space.sequelize.dao';
import UtilFunctions from '../utils/UtilFunctions';
import { HttpStatus, ResponseMessages } from '../types/enums';

dotenv.config();

export class SpaceController extends Singleton {
    private readonly dao: SpaceSequelizeDao = spaceSequelizeDao;

    public createSpace = UtilFunctions.catchAsync(async (req, res, next) => {
        const space = await this.dao.createSpace(req.body);

        UtilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.SPACE_CREATED, space);
    });

    public getSpaceById = UtilFunctions.catchAsync(async (req, res, next) => {
        const space = await this.dao.findById(req.params.id);

        UtilFunctions.sendResponse(res)(HttpStatus.OK, null, space);
    });

    // TODO pagination, limitation, sorting продумать логику как это будет работать
    public getSpacesByQuery = UtilFunctions.catchAsync(async (req, res, next) => {
        const spaces = await this.dao.getSpacesByQuery(req.query);

        UtilFunctions.sendResponse(res)(HttpStatus.OK, null, spaces);
    });

    public editSpaceById = UtilFunctions.catchAsync(async (req, res, next) => {
        // const space = await this.dao.editSpaceById(req.params.id, req.body);
        const space = await this.dao.editSpaceById(req.params.spaceId, req.user.id, req.body);

        UtilFunctions.sendResponse(res)(HttpStatus.OK, null);
    });

    public deleteSpaceById = UtilFunctions.catchAsync(async (req, res, next) => {});

    // NOTE
    public updateImages = UtilFunctions.catchAsync(async (req, res, next) => {});
    public removeImages = UtilFunctions.catchAsync(async (req, res, next) => {});
}

// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
export const spaceController = SingletonFactory.produce<SpaceController>(SpaceController);
