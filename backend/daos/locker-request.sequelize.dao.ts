import { Dao } from '../configurations/dao.config';
import { LockerRequest, LockerRequestType } from '../models/locker-request.model';
import { Space } from '../models/space.model';
import { ErrorMessages, HttpStatus, QueryDefaultValue } from '../types/enums';
import { IQueryString } from '../types/interfaces';
import AppError from '../utils/AppError';
import { SingletonFactory } from '../utils/Singleton';

interface ILockerRequestData {
    spaceId: string;
    phoneNumber: string;
}

interface IRequestLockerConnectionData extends ILockerRequestData {}

interface IRequestReturnLockerData extends ILockerRequestData {
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

    public requestLocker = async (requestLockerData: IRequestLockerConnectionData): Promise<LockerRequest> => {
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

        return this.model.create(requestLockerData);
    };

    public createReturnRequest = async ({ spaceId, phoneNumber, lockerId }: IRequestReturnLockerData) => {
        const space = await this.spaceModel.findOne({ where: { lockerId } });

        if (!space) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.FORBIDDEN);
        }

        return this.model.create({ id: parseInt(lockerId, 10), type: LockerRequestType.RETURN, phoneNumber, spaceId });
    };

    public getRequestsByQuery = async (query: IRequestQueryString) => {
        const page = query.page ? parseInt(query.page as string, 10) : QueryDefaultValue.PAGE;
        const limit = query.limit ? parseInt(query.limit as string, 10) : QueryDefaultValue.LIMIT;
        const type = query.type ?? '1';
        const offset = (page - 1) * limit;

        return this.model.findAll({ type: type as string, limit, offset });
    };

    public deleteConnectionRequest = async (spaceId: string): Promise<void> => {
        const connectionRequest = await this.lockerRequestModel.findOne({ where: { spaceId } });

        if (connectionRequest) {
            await connectionRequest.destroy();
        }
    };

    public deleteReturnRequest = async (spaceId: string) => {
        const returnRequest = await this.lockerRequestModel.findOne({ where: { spaceId } });

        if (returnRequest) {
            await returnRequest.destroy();
        }
    };

    /* 
    
    Пользователь отправляет заявку на подключение / отключение. Админ может либо отклонить, либо принять. и там и там 
    реквест должен удаляться из базы данных, поэтому функции будут вызываться.
    
    Пользователь отправляет заявку на подключение / отключение. Админ подтверждает через эндпоинты LockerController.

    
    */
}

export const lockerRequestSequelizeDao = SingletonFactory.produce<LockerRequestSequelizeDao>(LockerRequestSequelizeDao);
