import { Dao } from '../configurations/dao.config';
import { LockerRequest, LockerRequestType } from '../models/locker-request.model';
import { Space } from '../models/space.model';
import { ErrorMessages, HttpStatus, QueryDefaultValue } from '../types/enums';
import { IQueryString } from '../types/interfaces';
import AppError from '../utils/AppError';
import { SingletonFactory } from '../utils/Singleton';

interface ILockerRequestPayload {
    spaceId: string;
    phoneNumber: string;
}

interface IRequestLockerConnectionPayload extends ILockerRequestPayload {}

interface IRequestReturnLockerPayload extends ILockerRequestPayload {
    lockerId: string;
}

interface IRequestQueryString extends IQueryString {
    type: string | number;
}

export class LockerRequestSequelizeDao extends Dao {
    private readonly lockerRequestModel: typeof LockerRequest = LockerRequest;
    private readonly spaceModel: typeof Space = Space;

    get model(): typeof LockerRequest {
        return this.lockerRequestModel;
    }

    public requestLocker = async (requestLockerData: IRequestLockerConnectionPayload): Promise<LockerRequest> => {
        const { spaceId } = requestLockerData;

        const requestExists = await this.model.findOne({ where: { spaceId } });

        if (requestExists) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.SPACE_LOCKER_REQUEST_EXISTS);
        }

        const space = await this.spaceModel.findOne({ where: { id: spaceId } });

        if (!space) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.SPACE_NOT_FOUND);
        } else if (space.lockerId) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.SPACE_ALREADY_HAS_LOCKER);
        }

        return this.model.create({ ...requestLockerData, type: LockerRequestType.CONNECTION });
    };

    public createReturnRequest = async (requestReturnLockerData: IRequestReturnLockerPayload) => {
        const { spaceId, phoneNumber, lockerId } = requestReturnLockerData;
        const space = await this.spaceModel.findOne({ where: { lockerId } });

        if (!space) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.FORBIDDEN);
        }

        return this.model.create({ id: parseInt(lockerId, 10), type: LockerRequestType.RETURN, phoneNumber, spaceId });
    };

    public getRequestsByQuery = async (query: IRequestQueryString) => {
        const page = query.page ? parseInt(query.page as string, 10) : QueryDefaultValue.PAGE;
        const limit = query.limit ? parseInt(query.limit as string, 10) : QueryDefaultValue.LIMIT;
        // NOTE может вылезти ошибка - если мы не уточним query.type возможно ничего не будет найдено
        const type = query.type ?? undefined;
        const offset = (page - 1) * limit;

        return this.model.findAll({ type: type as string, limit, offset });
    };

    public getConnectionRequests = async (): Promise<LockerRequest[]> => {
        return this.model.findAll({ where: { type: LockerRequestType.CONNECTION } });
    };

    public getReturnRequests = async () => {
        return this.model.findAll({ where: { type: LockerRequestType.RETURN } });
    };

    public getRequestsAmount = (): Promise<number> => {
        return this.model.count();
    };

    // TODO: if everything works then remove below 2 methods
    public deleteConnectionRequest = async (spaceId: string): Promise<void> => {
        const connectionRequest = await this.lockerRequestModel.findOne({
            where: { spaceId, type: LockerRequestType.CONNECTION },
        });

        if (connectionRequest) {
            await connectionRequest.destroy();
        }
    };

    public deleteReturnRequest = async (spaceId: string): Promise<void> => {
        const returnRequest = await this.lockerRequestModel.findOne({
            where: { spaceId, type: LockerRequestType.RETURN },
        });

        if (returnRequest) {
            await returnRequest.destroy();
        }
    };

    public deleteRequestById = async (requestId: string): Promise<void> => {
        const request = await this.findById(requestId);

        if (request) {
            await request.destroy();
        }
    };
}

export const lockerRequestSequelizeDao = SingletonFactory.produce<LockerRequestSequelizeDao>(LockerRequestSequelizeDao);
