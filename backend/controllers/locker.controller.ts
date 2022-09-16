import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { Locker } from '../models/locker.model';
import { lockerSequelizeDao, LockerSequelizeDao } from '../daos/locker.sequelize.dao';

export interface IFindCitiesQuery {
    searchPattern: string;
}

export class LockerController extends Singleton {
    private readonly dao: LockerSequelizeDao = lockerSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public createLockerForSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
        await this.dao.createLockerForSpace(req.body);
    });

    public deleteLockerForSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { spaceId } = req.query;

        // lockerId должен будет доставаться из space? но ведь space ничего не знает о locker, в отличие от locker, который знает о space.
        // поэтому будем использовать spaceId.

        await this.dao.deleteLockerForSpace(spaceId);
    });
}

export const lockerController = SingletonFactory.produce<LockerController>(LockerController);
