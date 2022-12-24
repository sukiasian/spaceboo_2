"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lockerController = exports.LockerController = void 0;
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const locker_sequelize_dao_1 = require("../daos/locker.sequelize.dao");
const enums_1 = require("../types/enums");
const locker_request_model_1 = require("../models/locker-request.model");
class LockerController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = locker_sequelize_dao_1.lockerSequelizeDao;
        this.lockerRequestModel = locker_request_model_1.LockerRequest;
        this.utilFunctions = UtilFunctions_1.default;
        this.getLockersByQuery = this.utilFunctions.catchAsync(async (req, res, next) => {
            const lockers = await this.dao.getLockersByQuery(req.query);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, lockers);
        });
        this.pairLockerForSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
            const locker = await this.dao.createLockerForSpace(req.body);
            await this.deleteRequestAfterPairingUnpairing(req.body.spaceId);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.CREATED, enums_1.ResponseMessages.LOCKER_IS_PAIRED, locker);
        });
        this.unpairLockerForSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { spaceId } = req.query;
            await this.dao.deleteLockerForSpace(spaceId);
            await this.deleteRequestAfterPairingUnpairing(spaceId);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.LOCKER_IS_UNPAIRED, null);
        });
        this.deleteRequestAfterPairingUnpairing = async (spaceId) => {
            const pairingRequest = await this.lockerRequestModel.findOne({ where: { spaceId } });
            if (pairingRequest) {
                await pairingRequest.destroy();
            }
        };
    }
}
exports.LockerController = LockerController;
exports.lockerController = Singleton_1.SingletonFactory.produce(LockerController);
//# sourceMappingURL=locker.controller.js.map