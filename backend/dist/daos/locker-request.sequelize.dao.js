"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lockerRequestSequelizeDao = exports.LockerRequestSequelizeDao = void 0;
const dao_config_1 = require("../configurations/dao.config");
const locker_request_model_1 = require("../models/locker-request.model");
const space_model_1 = require("../models/space.model");
const enums_1 = require("../types/enums");
const AppError_1 = require("../utils/AppError");
const Singleton_1 = require("../utils/Singleton");
class LockerRequestSequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.lockerRequestModel = locker_request_model_1.LockerRequest;
        this.spaceModel = space_model_1.Space;
        this.requestLocker = async (requestLockerData) => {
            const { spaceId } = requestLockerData;
            const requestExists = await this.model.findOne({ where: { spaceId } });
            if (requestExists) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.SPACE_LOCKER_REQUEST_EXISTS);
            }
            const space = await this.spaceModel.findOne({ where: { id: spaceId } });
            if (!space) {
                throw new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, enums_1.ErrorMessages.SPACE_NOT_FOUND);
            }
            else if (space.lockerId) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.SPACE_ALREADY_HAS_LOCKER);
            }
            return this.model.create(Object.assign(Object.assign({}, requestLockerData), { type: locker_request_model_1.LockerRequestType.CONNECTION }));
        };
        this.createReturnRequest = async (requestReturnLockerData) => {
            // FIXME здесь достаточно просто предоставить spaceId
            const { phoneNumber, spaceId } = requestReturnLockerData;
            const space = await this.spaceModel.findOne({ where: { id: spaceId } });
            if (!space) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.FORBIDDEN);
            }
            return this.model.create({
                type: locker_request_model_1.LockerRequestType.RETURN,
                phoneNumber,
                spaceId: space.id,
            });
        };
        this.getRequestsByQuery = async (queryStr) => {
            const page = queryStr.page ? parseInt(queryStr.page, 10) : enums_1.QueryDefaultValue.PAGE;
            const limit = queryStr.limit ? parseInt(queryStr.limit, 10) : enums_1.QueryDefaultValue.LIMIT;
            // NOTE может вылезти ошибка - если мы не уточним query.type возможно ничего не будет найдено
            const type = queryStr.type;
            const offset = (page - 1) * limit;
            const findOptions = { offset, limit };
            if (queryStr.type) {
                findOptions.where = {
                    type: queryStr.type,
                };
            }
            return this.model.findAll(findOptions);
        };
        this.getRequestsAmount = () => {
            return this.model.count();
        };
        // TODO: if everything works then remove below 2 methods
        this.deleteConnectionRequest = async (spaceId) => {
            const connectionRequest = await this.lockerRequestModel.findOne({
                where: { spaceId, type: locker_request_model_1.LockerRequestType.CONNECTION },
            });
            if (connectionRequest) {
                await connectionRequest.destroy();
            }
        };
        this.deleteReturnRequest = async (spaceId) => {
            const returnRequest = await this.lockerRequestModel.findOne({
                where: { spaceId, type: locker_request_model_1.LockerRequestType.RETURN },
            });
            if (returnRequest) {
                await returnRequest.destroy();
            }
        };
        this.deleteRequestById = async (requestId) => {
            const request = await this.findById(requestId);
            if (request) {
                await request.destroy();
            }
        };
    }
    get model() {
        return this.lockerRequestModel;
    }
}
exports.LockerRequestSequelizeDao = LockerRequestSequelizeDao;
exports.lockerRequestSequelizeDao = Singleton_1.SingletonFactory.produce(LockerRequestSequelizeDao);
//# sourceMappingURL=locker-request.sequelize.dao.js.map