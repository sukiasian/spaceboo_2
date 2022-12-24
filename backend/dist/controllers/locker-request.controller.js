"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lockerRequestController = exports.LockerRequestController = void 0;
const Singleton_1 = require("../utils/Singleton");
const enums_1 = require("../types/enums");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const locker_request_sequelize_dao_1 = require("../daos/locker-request.sequelize.dao");
class LockerRequestController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = locker_request_sequelize_dao_1.lockerRequestSequelizeDao;
        this.utilFunctions = UtilFunctions_1.default;
        this.requestLocker = this.utilFunctions.catchAsync(async (req, res, next) => {
            const lockerRequest = await this.dao.requestLocker(req.body);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.LOCKER_REQUEST_CREATED, lockerRequest);
        });
        this.createReturnRequest = this.utilFunctions.catchAsync(async (req, res, next) => {
            const returnRequest = await this.dao.createReturnRequest(req.body);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.LOCKER_REQUEST_CREATED, returnRequest);
        });
        this.getRequestsByQuery = this.utilFunctions.catchAsync(async (req, res, next) => {
            const requests = await this.dao.getRequestsByQuery(req.query);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, requests);
        });
        this.getRequestsAmount = this.utilFunctions.catchAsync(async (req, res, next) => {
            const amount = await this.dao.getRequestsAmount();
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, amount);
        });
        this.deleteRequestById = this.utilFunctions.catchAsync(async (req, res, next) => {
            await this.dao.deleteRequestById(req.params.requestId);
        });
    }
}
exports.LockerRequestController = LockerRequestController;
exports.lockerRequestController = Singleton_1.SingletonFactory.produce(LockerRequestController);
//# sourceMappingURL=locker-request.controller.js.map