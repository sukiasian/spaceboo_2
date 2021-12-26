"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceController = exports.SpaceController = void 0;
const dotenv = require("dotenv");
const Singleton_1 = require("../utils/Singleton");
const space_sequelize_dao_1 = require("../daos/space.sequelize.dao");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const enums_1 = require("../types/enums");
dotenv.config();
class SpaceController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = space_sequelize_dao_1.spaceSequelizeDao;
        this.createSpace = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const space = await this.dao.createSpace(req.body);
            UtilFunctions_1.default.sendResponse(res)(enums_1.HttpStatus.CREATED, enums_1.ResponseMessages.SPACE_CREATED, space);
        });
        this.getSpaceById = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const space = await this.dao.findById(req.params.id);
            UtilFunctions_1.default.sendResponse(res)(enums_1.HttpStatus.OK, null, space);
        });
        // TODO pagination, limitation, sorting продумать логику как это будет работать
        this.getSpacesByQuery = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const spaces = await this.dao.getSpacesByQuery(req.query);
            UtilFunctions_1.default.sendResponse(res)(enums_1.HttpStatus.OK, null, spaces);
        });
        this.editSpaceById = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            // const space = await this.dao.editSpaceById(req.params.id, req.body);
            const space = await this.dao.editSpaceById(req.params.spaceId, req.user.id, req.body);
            UtilFunctions_1.default.sendResponse(res)(enums_1.HttpStatus.OK, null);
        });
        this.deleteSpaceById = UtilFunctions_1.default.catchAsync(async (req, res, next) => { });
        // NOTE
        this.updateImages = UtilFunctions_1.default.catchAsync(async (req, res, next) => { });
        this.removeImages = UtilFunctions_1.default.catchAsync(async (req, res, next) => { });
    }
}
exports.SpaceController = SpaceController;
// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
exports.spaceController = Singleton_1.SingletonFactory.produce(SpaceController);
//# sourceMappingURL=space.controller.js.map