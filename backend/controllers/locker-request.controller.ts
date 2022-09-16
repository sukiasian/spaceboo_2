import { Singleton, SingletonFactory } from '../utils/Singleton';
import { ErrorMessages, HttpStatus, ResponseMessages } from '../types/enums';
import UtilFunctions from '../utils/UtilFunctions';
import { IQueryString } from '../types/interfaces';
import { lockerRequestSequelizeDao, LockerRequestSequelizeDao } from '../daos/locker-request.sequelize.dao';
import { Space } from '../models/space.model';
import AppError from '../utils/AppError';

export interface IFindCitiesQuery {
    searchPattern: string;
}

export class LockerRequestController extends Singleton {
    private readonly spaceModel = Space;
    private readonly dao: LockerRequestSequelizeDao = lockerRequestSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public requestLocker = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const lockerRequest = await this.dao.requestLocker(req.body);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.LOCKER_REQUEST_CREATED, lockerRequest);
    });

    public getConnectionRequests = async (query: IQueryString) => {};

    public getReturnRequests = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {});
}

export const lockerRequestController = SingletonFactory.produce<LockerRequestController>(LockerRequestController);
