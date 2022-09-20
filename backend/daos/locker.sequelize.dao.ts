import { Dao } from '../configurations/dao.config';
import { LockerRequest } from '../models/locker-request.model';
import { Locker } from '../models/locker.model';
import { Space } from '../models/space.model';
import { SingletonFactory } from '../utils/Singleton';

interface ILockerPayload {
    spaceId: string;
}

interface ICreateLockerPayload extends ILockerPayload {
    lockerId: string;
    // NOTE неразумно на каждый локер записывать пароль арендодателя. А вообще пока нужно изучить документацию.
}

interface IDeleteLockerPayload extends ILockerPayload {}

export class LockerSequelizeDao extends Dao {
    private readonly lockerModel: typeof Locker = Locker;
    private readonly spaceModel: typeof Space = Space;
    private readonly lockerRequestModel: typeof LockerRequest = LockerRequest;

    get model(): typeof Locker {
        return this.lockerModel;
    }

    public createLockerForSpace = async (createLockerData: ICreateLockerPayload): Promise<Locker> => {
        // NOTE: это создаст локер для конкретного спейса.

        return this.model.create(createLockerData);
    };

    public deleteLockerForSpace = async (deleteLockerData: IDeleteLockerPayload) => {
        const locker = await this.model.findOne({ where: { spaceId: deleteLockerData.spaceId } });

        await locker.destroy();
    };
}

export const lockerSequelizeDao = SingletonFactory.produce<LockerSequelizeDao>(LockerSequelizeDao);
