"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceSequelizeDao = exports.SpaceSequelizeDao = exports.SpaceQuerySortFields = void 0;
const dao_config_1 = require("../configurations/dao.config");
const space_model_1 = require("../models/space.model");
const enums_1 = require("../types/enums");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const AppConfig_1 = require("../AppConfig");
const AppError_1 = require("../utils/AppError");
var SpaceQuerySortFields;
(function (SpaceQuerySortFields) {
    SpaceQuerySortFields["PRICEUP"] = "priceup";
    SpaceQuerySortFields["PRICEDOWN"] = "pricedown";
    SpaceQuerySortFields["OLDEST"] = "oldest";
    SpaceQuerySortFields["NEWEST"] = "newest";
})(SpaceQuerySortFields = exports.SpaceQuerySortFields || (exports.SpaceQuerySortFields = {}));
var SpaceSortFields;
(function (SpaceSortFields) {
    SpaceSortFields["PRICE"] = "pricePerNight";
    SpaceSortFields["DATE_OF_CREATION"] = "createdAt";
})(SpaceSortFields || (SpaceSortFields = {}));
class SpaceSequelizeDao extends dao_config_1.Dao {
    constructor() {
        super(...arguments);
        this.spaceModel = space_model_1.Space;
        this.utilFunctions = UtilFunctions_1.default;
        this.provideSpace = async (data, files) => {
            try {
                return this.model.create(data);
            }
            catch (err) {
                await this.findUploadedImagesAndRemove(data.userId, files);
                throw err;
            }
        };
        this.getSpacesByQuery = async (queryStr) => {
            let { page, limit, sortBy, datesToReserveQuery, timesToReserveQuery, cityId, priceRange } = queryStr;
            let isoDatesRange;
            let pricesFromAndTo;
            if (datesToReserveQuery) {
                datesToReserveQuery = datesToReserveQuery.split(',');
                timesToReserveQuery = timesToReserveQuery ? timesToReserveQuery.split(',') : ['14:00', '12:00'];
                isoDatesRange = UtilFunctions_1.default.createIsoDatesRangeToFindAppointments(datesToReserveQuery[0], timesToReserveQuery[0], datesToReserveQuery[1], timesToReserveQuery[1]);
            }
            // NOTE priceRange - если нет, то from должно быть от 0 - либо его вообще может не быть. но также может не быть to - как тогда быть ?
            if (priceRange) {
                priceRange = priceRange.split(',');
                priceRange = priceRange.map((price) => parseInt(price, 10));
                if (priceRange.length === 2) {
                    pricesFromAndTo = {
                        from: priceRange[0],
                        to: priceRange[1],
                    };
                }
                else {
                    pricesFromAndTo = {
                        from: priceRange[0],
                    };
                }
            }
            page = page ? page * 1 : 1;
            limit = limit ? limit * 1 : 20;
            const offset = (page - 1) * limit;
            const order = sortBy
                ? this.defineSortOrder(sortBy)
                : `s."${SpaceSortFields.DATE_OF_CREATION}" ${enums_1.QuerySortDirection.DESC}`;
            const queryFromParts = this.spacesQueryGeneratorByParts(order, limit, offset, isoDatesRange, cityId, pricesFromAndTo);
            return this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, queryFromParts);
        };
        this.getSpaceById = async (spaceId) => {
            if (!this.utilFunctions.isUUID(spaceId)) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.INVALID_ID);
            }
            const query = `SELECT * FROM "Spaces" s JOIN (SELECT id as "lockerId", "spaceId" as "lockerSpaceId" FROM "Lockers") l ON s."id" = l."lockerSpaceId" WHERE s."id" = '${spaceId}';`;
            const result = await this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, query);
            return result[0];
        };
        this.getUserSpaces = async (userId) => {
            return this.model.findAll({
                where: {
                    userId,
                },
            });
        };
        this.getSpacesForUserOutdatedAppointmentsIds = async (userId) => {
            if (!this.utilFunctions.isUUID(userId)) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.INVALID_ID);
            }
            const now = new Date().toISOString();
            const getOutdatedAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND UPPER(a."isoDatesReserved") < '${now}';`;
            const userOutdatedAppointments = (await this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, getOutdatedAppointmentsRawQuery));
            const spacesForUserOutdatedAppointments = await Promise.all(userOutdatedAppointments.map(async (appointment) => {
                const getSpaceForUserOutdatedAppointment = `SELECT * FROM "Appointments" a JOIN "Spaces" s ON a."spaceId" = s."id" WHERE a."id" = '${appointment.id}';`;
                return this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, getSpaceForUserOutdatedAppointment, { plain: true });
            }));
            return spacesForUserOutdatedAppointments;
        };
        this.getSpacesForUserActiveAppointmentsIds = async (userId) => {
            if (!this.utilFunctions.isUUID(userId)) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.INVALID_ID);
            }
            const now = new Date().toISOString();
            const getActiveAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND a."isoDatesReserved" @> '${now}'::timestamptz;`;
            const userActiveAppointments = (await this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, getActiveAppointmentsRawQuery));
            const spacesForUserActiveAppointments = await Promise.all(userActiveAppointments.map(this.getSpaceByAppointment));
            return spacesForUserActiveAppointments;
        };
        this.getSpacesForUserUpcomingAppointmentsIds = async (userId) => {
            if (!this.utilFunctions.isUUID(userId)) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.INVALID_ID);
            }
            const now = new Date().toISOString();
            const getUpcomingAppointmentsRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND LOWER(a."isoDatesReserved") > '${now}';`;
            const userUpcomingAppointments = (await this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, getUpcomingAppointmentsRawQuery));
            const spacesForUserUpcomingAppointments = await Promise.all(userUpcomingAppointments.map(this.getSpaceByAppointment));
            return spacesForUserUpcomingAppointments;
        };
        this.getSpaceByAppointment = async (appointment) => {
            if (!this.utilFunctions.isUUID(appointment.id)) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.INVALID_ID);
            }
            const getSpaceForUserOutdatedAppointment = `SELECT * FROM "Appointments" a JOIN "Spaces" s ON a."spaceId" = s."id" WHERE a."id" = '${appointment.id}';`;
            return (await this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, getSpaceForUserOutdatedAppointment, { plain: true }));
        };
        this.getSpacesForKeyControl = async (userId) => {
            if (!this.utilFunctions.isUUID(userId)) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.INVALID_ID);
            }
            const now = new Date().toISOString();
            const getUserActiveAppointmentsForLockConnectedSpacesRawQuery = `SELECT * FROM "Appointments" a WHERE a."userId" = '${userId}' AND "lockerConnected" = 'true' AND a."isoDatesReserved" @> '${now}'::timestamptz;`;
            const userActiveAppointments = (await this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, getUserActiveAppointmentsForLockConnectedSpacesRawQuery));
            const spacesForUserActiveAppointments = await Promise.all(userActiveAppointments.map(this.getSpaceByAppointment));
            return spacesForUserActiveAppointments;
        };
        this.editSpaceById = async (userId, spaceId, spaceEditData, files) => {
            try {
                const space = await this.model.findOne({ where: { id: spaceId } });
                await space.update(spaceEditData, { fields: space_model_1.spaceEditFields });
            }
            catch (err) {
                await this.findUploadedImagesAndRemove(userId, files);
                throw err;
            }
        };
        this.deleteSpaceById = async (spaceId) => {
            const space = await this.model.findOne({ where: { id: spaceId } });
            await space.destroy();
        };
        this.updateSpaceImagesInDb = async (userId, spaceId, spaceImagesToRemove, uploadedFiles) => {
            if (!this.utilFunctions.isUUID(spaceId)) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.INVALID_ID);
            }
            // NOTE SELECT array_cat(ARRAY[1,2,3], ARRAY[4,5]);
            const actualSpaceImagesUrls = (await this.findById(spaceId)).imagesUrl || [];
            let spaceImagesUrlsAfterRemoval = actualSpaceImagesUrls;
            for (const spaceImageToRemove of spaceImagesToRemove) {
                spaceImagesUrlsAfterRemoval = spaceImagesUrlsAfterRemoval.filter((el) => el !== spaceImageToRemove);
            }
            const spaceImagesToAddUrls = uploadedFiles.map((file) => {
                return `${userId}/${file.filename}`;
            });
            const newSpaceImagesUrlsFromRemainingAndNewOnes = [...spaceImagesUrlsAfterRemoval, ...spaceImagesToAddUrls];
            const newSpaceImagesUrlsFromRemainingAndNewOnesJoined = newSpaceImagesUrlsFromRemainingAndNewOnes.join(', ');
            const updateRawQuery = `UPDATE "Spaces" SET "imagesUrl" = ARRAY_CAT("imagesUrl", '{${newSpaceImagesUrlsFromRemainingAndNewOnesJoined}}') WHERE id = '${spaceId}';`;
            await this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, updateRawQuery);
        };
        this.removeSpaceImagesFromDb = async (spaceId, spaceImagesToDelete) => {
            if (!this.utilFunctions.isUUID(spaceId)) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.INVALID_ID);
            }
            let rawRemoveQueries = '';
            spaceImagesToDelete.forEach((spaceImageToDelete) => {
                rawRemoveQueries += `UPDATE "Spaces" SET "imagesUrl" = ARRAY_REMOVE("imagesUrl", '${spaceImageToDelete}') WHERE id = '${spaceId}';`;
            });
            await this.utilFunctions.createSequelizeRawQuery(AppConfig_1.appConfig.sequelize, rawRemoveQueries);
        };
        this.defineSortOrder = (sortBy) => {
            switch (sortBy) {
                case SpaceQuerySortFields.PRICEUP:
                    return `"${SpaceSortFields.PRICE}" ${enums_1.QuerySortDirection.ASC}`;
                case SpaceQuerySortFields.PRICEDOWN:
                    return `"${SpaceSortFields.PRICE}" ${enums_1.QuerySortDirection.DESC}`;
                case SpaceQuerySortFields.NEWEST:
                    return `"${SpaceSortFields.DATE_OF_CREATION}" ${enums_1.QuerySortDirection.DESC}`;
                case SpaceQuerySortFields.OLDEST:
                    return `"${SpaceSortFields.DATE_OF_CREATION}" ${enums_1.QuerySortDirection.ASC}`;
            }
        };
        this.spacesQueryGeneratorByParts = (order, limit, offset, isoDatesRange, cityId, priceRange) => {
            // NOTE 1. we can use separate functions  2. при отсутствии datesToReservePartialQuery возможна ошибка т.к. будет отсутствовать WHERE constraint. хотя тест проходит
            const cityPartialQuery = cityId ? `AND c."cityId" = ${cityId}` : '';
            const datesToReservePartialQuery = isoDatesRange
                ? `WHERE NOT EXISTS
        (SELECT 1 FROM "Appointments" a WHERE a."spaceId" = s."id"
        AND a."isoDatesReserved" && '${isoDatesRange}')`
                : '';
            const priceRangeFromPartialQuery = priceRange && priceRange.from !== undefined ? `AND s."pricePerNight" >= ${priceRange.from}` : '';
            const priceRangeToPartialQuery = priceRange && priceRange.to !== undefined ? `AND s."pricePerNight" <= ${priceRange.to}` : '';
            return `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", "regionId", name as "cityName" FROM "Cities") c ON s."cityId" = c."cityId" LEFT JOIN (SELECT id as "lockerId", "spaceId" as "lockerSpaceId" FROM "Lockers") l ON l."lockerSpaceId" = s."id" ${cityPartialQuery} ${datesToReservePartialQuery} ${priceRangeFromPartialQuery} ${priceRangeToPartialQuery} ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;
        };
        this.findUploadedImagesAndRemove = (userId, files) => {
            return Promise.all(files.map(async (file) => {
                await this.utilFunctions.findAndRemoveImage(userId, file.filename);
            }));
        };
    }
    get model() {
        return this.spaceModel;
    }
}
exports.SpaceSequelizeDao = SpaceSequelizeDao;
exports.spaceSequelizeDao = Singleton_1.SingletonFactory.produce(SpaceSequelizeDao);
//# sourceMappingURL=space.sequelize.dao.js.map