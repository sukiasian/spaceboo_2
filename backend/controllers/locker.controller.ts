import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { lockerSequelizeDao, LockerSequelizeDao } from '../daos/locker.sequelize.dao';
import { HttpStatus, ResponseMessages } from '../types/enums';
import { LockerRequest } from '../models/locker-request.model';

export class LockerController extends Singleton {
    private readonly dao: LockerSequelizeDao = lockerSequelizeDao;
    private readonly lockerRequestModel = LockerRequest;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public getLockersByQuery = this.utilFunctions.catchAsync(async (req, res, next) => {
        const lockers = await this.dao.getLockersByQuery(req.query);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, lockers);
    });

    public pairLockerForSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
        const locker = await this.dao.createLockerForSpace(req.body);

        await this.deleteRequestAfterPairingUnpairing(req.body.spaceId);

        this.utilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.LOCKER_IS_PAIRED, locker);
    });

    public unpairLockerForSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { spaceId } = req.query;

        await this.dao.deleteLockerForSpace(spaceId);
        await this.deleteRequestAfterPairingUnpairing(spaceId);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.LOCKER_IS_UNPAIRED, null);
    });

    private deleteRequestAfterPairingUnpairing = async (spaceId: string): Promise<void> => {
        const pairingRequest = await this.lockerRequestModel.findOne({ where: { spaceId } });

        if (pairingRequest) {
            await pairingRequest.destroy();
        }
    };
}

export const lockerController = SingletonFactory.produce<LockerController>(LockerController);
