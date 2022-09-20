import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { lockerSequelizeDao, LockerSequelizeDao } from '../daos/locker.sequelize.dao';

export class LockerController extends Singleton {
    private readonly dao: LockerSequelizeDao = lockerSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public pairLockerForSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
        await this.dao.createLockerForSpace(req.body);
    });

    public unpairLockerForSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { spaceId } = req.query;

        await this.dao.deleteLockerForSpace(spaceId);
    });
}

export const lockerController = SingletonFactory.produce<LockerController>(LockerController);
