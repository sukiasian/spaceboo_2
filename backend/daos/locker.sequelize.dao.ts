import { Dao } from '../configurations/dao.config';
import { Locker } from '../models/locker.model';
import { QueryDefaultValue } from '../types/enums';
import { IQueryString } from '../types/interfaces';
import { SingletonFactory } from '../utils/Singleton';

interface ILockerPayload {
    spaceId: string;
}

interface ICreateLockerPayload extends ILockerPayload {
    lockerId: string;
}

interface IDeleteLockerPayload extends ILockerPayload {}

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
        const lockers = await this.model.findAll({});
    };

    public createLockerForSpace = async (createLockerData: ICreateLockerPayload): Promise<Locker> => {
        return this.model.create(createLockerData);
    };

    public deleteLockerForSpace = async (deleteLockerData: IDeleteLockerPayload) => {
        const locker = await this.model.findOne({ where: { spaceId: deleteLockerData.spaceId } });

        await locker.destroy();
    };
}

export const lockerSequelizeDao = SingletonFactory.produce<LockerSequelizeDao>(LockerSequelizeDao);
