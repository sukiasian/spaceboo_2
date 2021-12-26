"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.closeTestEnv = exports.openTestEnv = exports.createTokenAndSign = exports.createSpaceData = exports.testUserValidationByMessages = exports.createInvalidUserData = exports.createUserData = exports.createApplicationInstance = exports.clearDb = exports.closeDb = exports.closeServer = exports.startDb = exports.startServer = void 0;
const faker = require("faker");
const jwt = require("jsonwebtoken");
const util_1 = require("util");
const App_1 = require("../App");
const connectToDb_1 = require("../database/connectToDb");
const Singleton_1 = require("../utils/Singleton");
const dotenv = require("dotenv");
const enums_1 = require("../types/enums");
const space_model_1 = require("../models/space.model");
dotenv.config({ path: '../test.env' });
const startServer = (app) => {
    return app.listen(process.env.PORT, () => {
        console.log('Test server is listening');
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
    console.log('Database connection is closed');
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
const createApplicationInstance = () => {
    return Singleton_1.SingletonFactory.produce(App_1.Application);
};
exports.createApplicationInstance = createApplicationInstance;
const createUserData = () => {
    return {
        name: faker.name.firstName(),
        middleName: faker.name.firstName(),
        surname: faker.name.lastName(),
        email: 'testuser@gmail.com',
        password: 'TestUser123',
        passwordConfirmation: 'TestUser123',
    };
};
exports.createUserData = createUserData;
const createInvalidUserData = () => {
    return {
        nameShort: 'a',
        nameExceeding: 'hugenameconsistingofmorethantwentyfive',
        nameWithDigits: 'testName7',
        middleNameShort: 'a',
        middleNameExceeding: 'hugenameconsistingofmorethantwentyfive',
        middleNameWithDigits: 'testMiddleName7',
        surnameShort: 'a',
        surnameExceeding: 'hugenameconsistingofmorethantwentyfive',
        surnnameWithDigits: 'testSurname7',
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
const createSpaceData = (userId, cityId) => {
    return {
        address: faker.address.streetAddress(),
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
// export const createDatesToReserve = (beginningDate: string, endingDate: string, space: Space): TDatesReserved => {
//     return [
//         { inclusive: true, value: createCustomDate(beginningDate, space['city.timezone']) },
//         { inclusive: false, value: createCustomDate(endingDate, space['city.timezone']) },
//     ];
// };
// const timeValueToDoubleDigitParser = (value) => {
//     return value > 9 ? `${value}` : `0${value}`;
// };
// export const createCustomDate = (dateRawValue: string, timezone: string): string => {
//     const date = new Date(dateRawValue);
//     const year = date.getFullYear();
//     const month = timeValueToDoubleDigitParser(date.getMonth() + 1);
//     const day = timeValueToDoubleDigitParser(date.getDate());
//     const hours = timeValueToDoubleDigitParser(date.getHours());
//     const minutes = timeValueToDoubleDigitParser(date.getMinutes());
//     const seconds = timeValueToDoubleDigitParser(date.getSeconds());
//     let milliseconds: any = date.getMilliseconds() / 1000;
//     milliseconds = Math.floor(milliseconds.toFixed(2) * 100);
//     return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${UtilFunctions.timezoneParser(
//         timezone
//     )}`;
// };
const createTokenAndSign = async (payload) => {
    const signToken = util_1.promisify(jwt.sign);
    switch (typeof payload) {
        case 'string':
            return signToken(payload, process.env.JWT_SECRET_KEY);
        case 'object':
            return signToken(payload, process.env.JWT_SECRET_KEY);
    }
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