"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceController = exports.SpaceController = void 0;
const Singleton_1 = require("../utils/Singleton");
const space_sequelize_dao_1 = require("../daos/space.sequelize.dao");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const enums_1 = require("../types/enums");
const AppError_1 = require("../utils/AppError");
const Redis_1 = require("../Redis");
class SpaceController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.dao = space_sequelize_dao_1.spaceSequelizeDao;
        this.utilFunctions = UtilFunctions_1.default;
        this.redisClient = Redis_1.redis.client;
        this.createSpaceAttemptsPerDay = '4';
        this.provideSpace = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            if (!req.files || req.files.length === 0) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.SPACE_IMAGES_ARE_NOT_PROVIDED);
            }
            if (!req.body.cityId) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.PICK_CITY_FROM_THE_LIST);
            }
            const space = await this.dao.provideSpace(Object.assign(Object.assign({}, req.body), { userId }), req.files);
            res.locals.spaceId = space.id;
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.CREATED, enums_1.ResponseMessages.SPACE_PROVIDED, space);
            next();
        });
        this.getSpaceById = this.utilFunctions.catchAsync(async (req, res, next) => {
            const space = await this.dao.getSpaceById(req.params.spaceId);
            if (!space) {
                throw new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, enums_1.ErrorMessages.SPACE_NOT_FOUND);
            }
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, space);
        });
        this.getSpacesByQuery = this.utilFunctions.catchAsync(async (req, res, next) => {
            const spaces = await this.dao.getSpacesByQuery(req.query);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, spaces);
        });
        this.getSpacesByUserId = this.utilFunctions.catchAsync(async (req, res, next) => {
            const spaces = await this.dao.getUserSpaces(req.user.id);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, spaces);
        });
        this.getSpacesForUserOutdatedAppointmentsIds = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            const spacesForOutdatedAppointments = await this.dao.getSpacesForUserOutdatedAppointmentsIds(userId);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, spacesForOutdatedAppointments);
        });
        this.getSpacesForUserActiveAppointmentsIds = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            const spacesForActiveAppointments = await this.dao.getSpacesForUserActiveAppointmentsIds(userId);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, spacesForActiveAppointments);
        });
        this.getSpacesForUserUpcomingAppointmentsIds = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            const spacesForUpcomingAppointments = await this.dao.getSpacesForUserUpcomingAppointmentsIds(userId);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, spacesForUpcomingAppointments);
        });
        this.getSpacesForKeyControl = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            const spacesForKeyControl = await this.dao.getSpacesForKeyControl(userId);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, null, spacesForKeyControl);
        });
        this.editSpaceById = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            const { spaceId } = req.params;
            const { spaceEditData } = req.body;
            await this.dao.editSpaceById(userId, spaceId, spaceEditData, req.files);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.DATA_UPDATED);
            next();
        });
        this.deleteSpaceById = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { spaceId } = req.params;
            await this.dao.deleteSpaceById(spaceId);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.SPACE_DELETED);
        });
        this.checkAttempts = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            const createSpaceAttemptsKey = `${enums_1.RedisVariable.CREATE_SPACE_ATTEMPTS}:${userId}`;
            const createSpaceAttemptsValue = await this.redisClient.get(createSpaceAttemptsKey);
            if (createSpaceAttemptsValue === null) {
                await this.redisClient.set(createSpaceAttemptsKey, '1');
            }
            else if (createSpaceAttemptsValue === this.createSpaceAttemptsPerDay) {
                await this.redisClient.setEx(createSpaceAttemptsKey, process.env.NODE_ENV === enums_1.Environment.DEVELOPMENT ? 10 : 60 * 60 * 24, this.createSpaceAttemptsPerDay);
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.CREATE_SPACE_LIMIT_EXCEEDED);
            }
            else {
                await this.redisClient.set(createSpaceAttemptsKey, `${this.utilFunctions.makeDecimal(createSpaceAttemptsValue) + 1}`);
            }
            next();
        });
    }
}
exports.SpaceController = SpaceController;
// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
exports.spaceController = Singleton_1.SingletonFactory.produce(SpaceController);
//# sourceMappingURL=space.controller.js.map