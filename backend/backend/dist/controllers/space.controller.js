"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceController = exports.SpaceController = void 0;
const Singleton_1 = require("../utils/Singleton");
const space_sequelize_dao_1 = require("../daos/space.sequelize.dao");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const enums_1 = require("../types/enums");
class SpaceController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = space_sequelize_dao_1.spaceSequelizeDao;
        this.utilFunctions = UtilFunctions_1.default;
        this.provideSpace = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            console.log(req.body, 'bodyyyyy');
            const { id: userId } = req.user;
            const space = await this.dao.provideSpace(Object.assign(Object.assign({}, req.body), { userId }));
            req.space = space;
            next();
        });
        this.sendProvideSpaceResponse = this.utilFunctions.catchAsync(async (req, res, next) => {
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.SPACE_PROVIDED, req.space);
        });
        this.getSpaceById = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const space = await this.dao.findById(req.params.id);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, space);
        });
        // TODO pagination, limitation, sorting продумать логику как это будет работать
        this.getSpacesByQuery = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const spaces = await this.dao.getSpacesByQuery(req.query);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, spaces);
        });
        this.editSpaceById = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const { spaceId } = req.params;
            const { spaceEditData } = req.body;
            await this.dao.editSpaceById(spaceId, spaceEditData);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.DATA_UPDATED);
        });
        this.deleteSpaceById = UtilFunctions_1.default.catchAsync(async (req, res, next) => {
            const { spaceId } = req.params;
            await this.dao.deleteSpaceById(spaceId);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.SPACE_DELETED);
        });
    }
}
exports.SpaceController = SpaceController;
// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
exports.spaceController = Singleton_1.SingletonFactory.produce(SpaceController);
//# sourceMappingURL=space.controller.js.map