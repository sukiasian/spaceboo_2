import { Singleton, SingletonFactory } from '../utils/Singleton';
import { HttpStatus, ResponseMessages } from '../types/enums';
import UtilFunctions from '../utils/UtilFunctions';
import { lockerRequestSequelizeDao, LockerRequestSequelizeDao } from '../daos/locker-request.sequelize.dao';

export interface IFindCitiesQuery {
    searchPattern: string;
}

export class LockerRequestController extends Singleton {
    private readonly dao: LockerRequestSequelizeDao = lockerRequestSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public requestLocker = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const lockerRequest = await this.dao.requestLocker(req.body);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.LOCKER_REQUEST_CREATED, lockerRequest);
    });

    public createReturnRequest = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const returnRequest = await this.dao.createReturnRequest(req.body);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.LOCKER_REQUEST_CREATED, returnRequest);
    });

    // public getConnectionRequests = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
    //     const requests = await this.dao.getConnectionRequests();

    //     this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, requests);
    // });

    // public getReturnRequests = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
    //     const requests = await this.dao.getReturnRequests();

    //     this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, requests);
    // });

    public getRequestsByQuery = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const requests = await this.dao.getReturnRequests();

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, requests);
    });

    public getRequestsAmount = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const amount = await this.dao.getRequestsAmount();

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, amount);
    });

    public deleteRequestById = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        await this.dao.deleteRequestById(req.params.requestId);
    });
}

export const lockerRequestController = SingletonFactory.produce<LockerRequestController>(LockerRequestController);
