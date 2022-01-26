"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeTestEnv = exports.openTestEnv = exports.createTokenAndSign = exports.createAppoinmentData = exports.createPathToSpaceImagesDir = exports.createPathToUserAvatarDir = exports.createSpaceData = exports.testUserValidationByMessages = exports.createInvalidUserData = exports.createUserData = exports.createApplicationInstance = exports.clearDbAndStorage = exports.clearStorage = exports.clearDb = exports.closeDb = exports.closeServer = exports.startDb = exports.startServer = void 0;
const faker = require("faker");
const jwt = require("jsonwebtoken");
const path = require("path");
const App_1 = require("../App");
const connectToDb_1 = require("../database/connectToDb");
const Singleton_1 = require("../utils/Singleton");
const dotenv = require("dotenv");
const enums_1 = require("../types/enums");
const space_model_1 = require("../models/space.model");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const logger_1 = require("../loggers/logger");
dotenv.config({ path: '../test.env' });
const startServer = (app) => {
    return app.listen(process.env.PORT, () => {
        logger_1.default.info('Test server is listening');
    });
};
exports.startServer = startServer;
const startDb = async (sequelize) => {
    await connectToDb_1.default(sequelize);
};
exports.startDb = startDb;
const closeServer = async (server) => {
    await server.close();
};
exports.closeServer = closeServer;
const closeDb = async (sequelize) => {
    await sequelize.close();
    logger_1.default.info('Database connection is closed');
};
exports.closeDb = closeDb;
const clearDb = (sequelize) => {
    Promise.all(Object.values(sequelize.models).map(async (model) => {
        if (model.name !== enums_1.ModelNames.CITY) {
            await model.destroy({ truncate: true, cascade: true });
        }
    }));
};
exports.clearDb = clearDb;
const clearStorage = () => {
    const dirPaths = [path.resolve('assets', 'images', 'users'), path.resolve('assets', 'images', 'spaces')];
    Promise.all(dirPaths.map(async (dirPath) => {
        await UtilFunctions_1.default.removeDirectory(dirPath, { recursive: true });
        await UtilFunctions_1.default.makeDirectory(dirPath);
    }));
};
exports.clearStorage = clearStorage;
const clearDbAndStorage = async (sequelize) => {
    exports.clearDb(sequelize);
    exports.clearStorage();
};
exports.clearDbAndStorage = clearDbAndStorage;
const createApplicationInstance = () => {
    return Singleton_1.SingletonFactory.produce(App_1.Application);
};
exports.createApplicationInstance = createApplicationInstance;
const createUserData = () => {
    return {
        name: 'Иван',
        middleName: 'Иванов',
        surname: 'Иванович',
        email: faker.internet.email(),
        password: 'TestUser123',
        passwordConfirmation: 'TestUser123',
        confirmed: true,
    };
};
exports.createUserData = createUserData;
const createInvalidUserData = () => {
    return {
        nameShort: 'а',
        nameExceeding: 'Ааааааааааааааааааааааааааааааааааааа',
        nameWithDigits: 'Иван1',
        middleNameShort: 'а',
        middleNameExceeding: 'Петровиииииииииииииииииииииииич',
        middleNameWithDigits: 'Петрович1',
        surnameShort: 'а',
        surnameExceeding: 'Иванооооооооооооооооооооов',
        surnnameWithDigits: 'Иванов1',
        email: 'invalid email',
        passwordShort: '6digit',
        passwordExceeding: 'twentyfivedigitpassword25passcode',
    };
};
exports.createInvalidUserData = createInvalidUserData;
const testUserValidationByMessages = async (model, userData, message, expect) => {
    try {
        await model.create(userData);
    }
    catch (err) {
        expect(err.errors[0].message).toBe(message);
    }
};
exports.testUserValidationByMessages = testUserValidationByMessages;
const createSpaceData = (userId, cityId, pricePerNight = 1000) => {
    return {
        address: faker.address.streetAddress(),
        pricePerNight,
        type: space_model_1.SpaceType.FLAT,
        roomsNumber: 2,
        imagesUrl: ['/public/images/space/1.jpg'],
        lockerConnected: false,
        facilities: ['TV'],
        description: faker.lorem.sentence(5),
        userId,
        cityId,
    };
};
exports.createSpaceData = createSpaceData;
const createPathToUserAvatarDir = (userId) => {
    return path.resolve('assets', 'images', 'users', userId);
};
exports.createPathToUserAvatarDir = createPathToUserAvatarDir;
const createPathToSpaceImagesDir = (spaceId) => {
    return path.resolve('assets', 'images', 'spaces', spaceId);
};
exports.createPathToSpaceImagesDir = createPathToSpaceImagesDir;
const createAppoinmentData = (isoDatesReserved, spaceId, userId) => {
    return {
        isoDatesReserved,
        userId,
        spaceId,
    };
};
exports.createAppoinmentData = createAppoinmentData;
const createTokenAndSign = async (payload) => {
    // FIXME its not a promise
    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};
exports.createTokenAndSign = createTokenAndSign;
const openTestEnv = async (applicationInstance) => {
    applicationInstance.setupPassport();
    applicationInstance.configureApp();
    await exports.startDb(applicationInstance.sequelize);
    const server = exports.startServer(applicationInstance.app); // NOTE
    return {
        server,
    };
};
exports.openTestEnv = openTestEnv;
const closeTestEnv = async (sequelize, server) => {
    await exports.closeDb(sequelize);
    await exports.closeServer(server);
};
exports.closeTestEnv = closeTestEnv;
//# sourceMappingURL=lib.js.map