import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { lockerSequelizeDao, LockerSequelizeDao } from '../daos/locker.sequelize.dao';
import { HttpStatus, ResponseMessages } from '../types/enums';

export class LockerController extends Singleton {
    private readonly dao: LockerSequelizeDao = lockerSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public getLockersByQuery = this.utilFunctions.catchAsync(async (req, res, next) => {
        const lockers = await this.dao.getLockersByQuery(req.query);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, lockers);
    });

    public pairLockerForSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
        const locker = await this.dao.createLockerForSpace(req.body);

        this.utilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.LOCKER_IS_PAIRED, locker);
    });

    public unpairLockerForSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { spaceId } = req.query;

        await this.dao.deleteLockerForSpace(spaceId);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.LOCKER_IS_UNPAIRED, null);
    });
}

export const lockerController = SingletonFactory.produce<LockerController>(LockerController);
