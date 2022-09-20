import { default as axios } from 'axios';
import { Locker } from '../models/locker.model';
import { ErrorMessages, HttpStatus, ResponseMessages, TTLockApiRoute } from '../types/enums';
import AppError from '../utils/AppError';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

type TAccessToken = string;

interface IUnlockPayload {
    clientId: string;
    accessToken: TAccessToken;
    lockId: number;
    date: number;
}

export class TTLockController extends Singleton {
    private readonly lockerModel: typeof Locker = Locker;

    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;
    private requestOptions = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    };

    private getAccessToken = async (locker: Locker): Promise<TAccessToken> => {
        const payload = new URLSearchParams();

        payload.append('clientId', process.env.TTLOCK_CLIENT_ID);
        payload.append('clientSecret', process.env.TTLOCK_CLIENT_SECRET);
        payload.append('username', locker.ttlockEmail);
        payload.append('password', locker.ttlockPassword);

        const res = await axios.post(TTLockApiRoute.GET_ACCESS_TOKEN, payload, this.requestOptions);

        if (res.data.errmsg) {
            throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.FORBIDDEN);
        }

        return res.data.accessToken;
    };

    public unlock = UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { spaceId } = req.query;

        const locker = await this.lockerModel.findOne({ where: { spaceId } });
        const accessToken = await this.getAccessToken(spaceId);

        const payload: IUnlockPayload = {
            accessToken,
            lockId: locker.id,
            clientId: process.env.TTLOCK_CLIENT_ID,
            date: Date.now(),
        };

        const ttLockResponse = await axios.post(TTLockApiRoute.UNLOCK_LOCKER, payload, this.requestOptions);

        if (ttLockResponse.data.errcode !== 0) {
            throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.ERROR);
        }

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.LOCKER_UNLOCKED, null);
    });
}

export const ttLockController = SingletonFactory.produce<TTLockController>(TTLockController);
