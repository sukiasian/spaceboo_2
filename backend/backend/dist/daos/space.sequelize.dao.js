"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceSequelizeDao = exports.SpaceSequelizeDao = exports.SpaceQuerySortFields = void 0;
const dao_config_1 = require("../configurations/dao.config");
const space_model_1 = require("../models/space.model");
const enums_1 = require("../types/enums");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const App_1 = require("../App");
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
        // NOTE аутентификация - протекция роута (только для авторизованных пользователей)
        this.provideSpace = async (data) => {
            return this.model.create(data);
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
            /*
            
            priceRange - если нет, то from должно быть от 0 - либо его вообще может не быть.
            но также может не быть to - как тогда быть ?
            
            */
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
                : `"${SpaceSortFields.DATE_OF_CREATION}" ${enums_1.QuerySortDirection.DESC}`;
            // let spacesRawQuery = `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", city, city_type, timezone, region, region_type, supports_locker FROM "Cities") c ON s."cityId" = c."cityId" ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;
            // // NOTE horrible architecture
            // if (datesToReserveQuery && !cityId) {
            //     spacesRawQuery = `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", city, city_type, timezone, region, region_type, supports_locker FROM "Cities") c ON s."cityId" = c."cityId" WHERE NOT EXISTS
            //         (SELECT 1 FROM "Appointments" a WHERE a."spaceId" = s."id"
            //         AND a."isoDatesReserved" && '${isoDatesRange}') ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;
            // }
            // if (cityId && !datesToReserveQuery) {
            //     spacesRawQuery = `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", city, city_type, timezone, region, region_type, supports_locker FROM "Cities") c ON s."cityId" = c."cityId" AND c."cityId" = ${cityId} ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;
            // }
            // if (datesToReserveQuery && cityId) {
            //     spacesRawQuery = `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", city, city_type, timezone, region, region_type, supports_locker FROM "Cities") c ON s."cityId" = c."cityId" AND c."cityId" = ${cityId} WHERE NOT EXISTS
            //         (SELECT 1 FROM "Appointments" a WHERE a."spaceId" = s."id"
            //         AND a."isoDatesReserved" && '${isoDatesRange}') ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;
            // }
            const queryFromParts = this.spacesQueryGeneratorByParts(order, limit, offset, isoDatesRange, cityId, pricesFromAndTo);
            return this.utilFunctions.createSequelizeRawQuery(App_1.applicationInstance.sequelize, queryFromParts);
        };
        this.editSpaceById = async (spaceId, spaceEditData) => {
            const space = await this.model.findOne({ where: { id: spaceId } });
            await space.update(spaceEditData, { fields: space_model_1.spaceEditFields });
        };
        this.deleteSpaceById = async (spaceId) => {
            const space = await this.model.findOne({ where: { id: spaceId } });
            await space.destroy();
        };
        this.updateSpaceImagesInDb = async (spaceId, spaceImagesUrl) => {
            const spaceImagesUrlJoined = spaceImagesUrl.join(', ');
            // NOTE SELECT array_cat(ARRAY[1,2,3], ARRAY[4,5]);
            const updateRawQuery = `UPDATE "Spaces" SET "imagesUrl" = ARRAY_CAT("imagesUrl", '{${spaceImagesUrlJoined}}') WHERE id = '${spaceId}';`;
            await this.utilFunctions.createSequelizeRawQuery(App_1.applicationInstance.sequelize, updateRawQuery);
        };
        this.removeSpaceImagesFromDb = async (spaceId, spaceImagesToDelete) => {
            // FIXME better add a custom postgres function
            let rawRemoveQueries = '';
            spaceImagesToDelete.forEach((spaceImageToDelete) => {
                rawRemoveQueries += `UPDATE "Spaces" SET "imagesUrl" = ARRAY_REMOVE("imagesUrl", '${spaceImageToDelete}') WHERE id = '${spaceId}';`;
            });
            await this.utilFunctions.createSequelizeRawQuery(App_1.applicationInstance.sequelize, rawRemoveQueries);
        };
        this.defineSortOrder = (sortBy) => {
            switch (sortBy) {
                case SpaceQuerySortFields.PRICEUP:
                    return `"${SpaceSortFields.PRICE}" ${enums_1.QuerySortDirection.ASC}`;
                case SpaceQuerySortFields.PRICEDOWN:
                    return `"${SpaceSortFields.PRICE}" ${enums_1.QuerySortDirection.DESC}`;
                case SpaceQuerySortFields.NEWEST:
                    return `"${SpaceSortFields.DATE_OF_CREATION}" ${enums_1.QuerySortDirection.ASC}`;
                case SpaceQuerySortFields.OLDEST:
                    return `"${SpaceSortFields.DATE_OF_CREATION}" ${enums_1.QuerySortDirection.DESC}`;
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
            return `SELECT * FROM "Spaces" s JOIN (SELECT id as "cityId", city, city_type, timezone, region, region_type, supports_locker FROM "Cities") c ON s."cityId" = c."cityId" ${cityPartialQuery} ${datesToReservePartialQuery} ${priceRangeFromPartialQuery} ${priceRangeToPartialQuery} ORDER BY ${order} LIMIT ${limit} OFFSET ${offset};`;
        };
    }
    get model() {
        return this.spaceModel;
    }
}
exports.SpaceSequelizeDao = SpaceSequelizeDao;
exports.spaceSequelizeDao = Singleton_1.SingletonFactory.produce(SpaceSequelizeDao);
//# sourceMappingURL=space.sequelize.dao.js.map