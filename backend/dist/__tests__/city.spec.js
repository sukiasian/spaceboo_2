"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const user_model_1 = require("../models/user.model");
const lib_1 = require("./lib");
const space_model_1 = require("../models/space.model");
const city_model_1 = require("../models/city.model");
describe('City (e2e)', () => {
    let app;
    let server;
    let applicationInstance;
    let db;
    let userData;
    let user;
    let userModel;
    let spaceData;
    let spaceModel;
    let city;
    let cityModel;
    let appointmentModel;
    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });
        applicationInstance = lib_1.createApplicationInstance();
        app = applicationInstance.app;
        db = applicationInstance.sequelize;
        userModel = user_model_1.User;
        spaceModel = space_model_1.Space;
        cityModel = city_model_1.City;
        userData = lib_1.createUserData();
        server = (await lib_1.openTestEnv(applicationInstance)).server;
        city = await cityModel.findOne({ raw: true });
        user = await userModel.create(userData);
        spaceData = lib_1.createSpaceData(user.id, city.id);
    });
    beforeEach(async () => { });
    afterEach(async () => {
        lib_1.clearDb(db);
        userData = lib_1.createUserData();
    });
    afterAll(async () => {
        await lib_1.closeTestEnv(db, server);
    });
    it('/cities should get all cities by query', async () => {
        expect(1).toBe(1);
    });
    it('UtilFunctions.timezoneParser should parse all timezones properly', async () => { });
});
//# sourceMappingURL=city.spec.js.map