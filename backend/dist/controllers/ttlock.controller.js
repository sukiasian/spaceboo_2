"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ttLockController = exports.TTLockController = void 0;
const axios_1 = require("axios");
const locker_model_1 = require("../models/locker.model");
const enums_1 = require("../types/enums");
const AppError_1 = require("../utils/AppError");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
class TTLockController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.lockerModel = locker_model_1.Locker;
        this.utilFunctions = UtilFunctions_1.default;
        this.requestOptions = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        };
        this.getAccessToken = async (locker) => {
            const payload = new URLSearchParams();
            payload.append('clientId', process.env.TTLOCK_CLIENT_ID);
            payload.append('clientSecret', process.env.TTLOCK_CLIENT_SECRET);
            payload.append('username', locker.ttlockEmail);
            payload.append('password', locker.ttlockPassword);
            const res = await axios_1.default.post(enums_1.TTLockApiRoute.GET_ACCESS_TOKEN, payload, this.requestOptions);
            if (res.data.errmsg) {
                throw new AppError_1.default(enums_1.HttpStatus.BAD_REQUEST, enums_1.ErrorMessages.FORBIDDEN);
            }
            return res.data.accessToken;
        };
        this.unlock = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const { spaceId } = req.query;
            const locker = await this.lockerModel.findOne({ where: { spaceId } });
            const accessToken = await this.getAccessToken(spaceId);
            const payload = {
                accessToken,
                lockId: locker.id,
                clientId: process.env.TTLOCK_CLIENT_ID,
                date: Date.now(),
            };
            const ttLockResponse = await axios_1.default.post(enums_1.TTLockApiRoute.UNLOCK_LOCKER, payload, this.requestOptions);
            if (ttLockResponse.data.errcode !== 0) {
                throw new AppError_1.default(enums_1.HttpStatus.BAD_REQUEST, enums_1.ErrorMessages.ERROR);
            }
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.LOCKER_UNLOCKED, null);
        });
    }
}
exports.TTLockController = TTLockController;
exports.ttLockController = Singleton_1.SingletonFactory.produce(TTLockController);
//# sourceMappingURL=ttlock.controller.js.map