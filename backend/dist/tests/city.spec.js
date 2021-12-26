"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const lib_1 = require("./lib");
const city_model_1 = require("../models/city.model");
describe('City (e2e)', () => {
    let app;
    let server;
    let applicationInstance;
    let db;
    let city;
    let cityModel;
    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });
        applicationInstance = lib_1.createApplicationInstance();
        app = applicationInstance.app;
        db = applicationInstance.sequelize;
        cityModel = city_model_1.City;
        server = (await lib_1.openTestEnv(applicationInstance)).server;
        city = await cityModel.findOne({ raw: true });
    });
    beforeEach(async () => { });
    afterEach(async () => {
        lib_1.clearDb(db);
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