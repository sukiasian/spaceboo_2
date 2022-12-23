import { Dao } from '../configurations/dao.config';
import { Locker } from '../models/locker.model';
import { Space } from '../models/space.model';
import { ErrorMessages, HttpStatus, QueryDefaultValue } from '../types/enums';
import { IQueryString } from '../types/interfaces';
import AppError from '../utils/AppError';
import { SingletonFactory } from '../utils/Singleton';

interface ILockerPayload {
    spaceId: string;
}

interface ICreateLockerPayload extends ILockerPayload {
    lockerId: string;
    ttlockEmail: string;
    ttlockPassword: string;
}

interface ILockerQueryString extends IQueryString {}

export class LockerSequelizeDao extends Dao {
    private readonly lockerModel: typeof Locker = Locker;

    get model(): typeof Locker {
        return this.lockerModel;
    }

    public getLockersByQuery = async (queryStr: ILockerQueryString) => {
        const page = queryStr.page ? parseInt(queryStr.page as string, 10) : QueryDefaultValue.PAGE;
        const limit = queryStr.limit ? parseInt(queryStr.limit as string, 10) : QueryDefaultValue.LIMIT;

        const offset = (page - 1) * limit;

        return this.model.findAll({ limit, offset, include: [Space] });
    };

    public createLockerForSpace = async (createLockerData: ICreateLockerPayload): Promise<Locker> => {
        return this.model.create(createLockerData);
    };

    public deleteLockerForSpace = async (spaceId: string) => {
        const locker = await this.model.findOne({ where: { spaceId } });

        if (!locker) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.LOCKER_NOT_FOUND_FOR_SPACE);
        }

        await locker.destroy();
    };
}

export const lockerSequelizeDao = SingletonFactory.produce<LockerSequelizeDao>(LockerSequelizeDao);
