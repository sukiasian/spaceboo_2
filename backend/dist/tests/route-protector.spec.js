"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const user_model_1 = require("../models/user.model");
const lib_1 = require("./lib");
const enums_1 = require("../types/enums");
const space_model_1 = require("../models/space.model");
const appointment_model_1 = require("../models/appointment.model");
const city_model_1 = require("../models/city.model");
describe('Route Protector (e2e)', () => {
    let app;
    let server;
    let appConfig;
    let db;
    let user_1;
    let user_2;
    let userData_1;
    let userData_2;
    let token_1;
    let token_2;
    let userModel;
    let spaceData_1;
    let spaceData_2;
    let spaceModel;
    let city;
    let cityModel;
    let space_1;
    let appointmentModel;
    beforeAll(async () => {
        appConfig = (0, lib_1.createAppConfig)();
        app = appConfig.app;
        db = appConfig.sequelize;
        userModel = user_model_1.User;
        spaceModel = space_model_1.Space;
        cityModel = city_model_1.City;
        appointmentModel = appointment_model_1.Appointment;
        userData_1 = (0, lib_1.createUserData)();
        userData_2 = (0, lib_1.createUserData)();
        server = (await (0, lib_1.openTestEnv)(appConfig)).server;
    });
    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        user_1 = await userModel.create(userData_1);
        user_2 = await userModel.create(userData_2);
        spaceData_1 = (0, lib_1.createSpaceData)(user_1.id, city.id);
        spaceData_2 = (0, lib_1.createSpaceData)(user_2.id, city.id);
        space_1 = await spaceModel.create(spaceData_1, { include: [city_model_1.City] });
        space_1 = await spaceModel.findOne({
            where: { id: space_1.id },
            include: [city_model_1.City, appointment_model_1.Appointment],
        });
        token_1 = await (0, lib_1.createTokenAndSign)({ id: user_1.id });
        token_2 = await (0, lib_1.createTokenAndSign)({ id: user_2.id });
    });
    afterEach(async () => {
        (0, lib_1.clearDb)(db);
    });
    afterAll(async () => {
        await (0, lib_1.closeTestEnv)(db, server);
    });
    it('DELETE /images/users/:spaceId should disallow non-space owners to delete space images', async () => {
        // создать другого юзера user_2 и обратиться к space_1
        const res = await request(app)
            .delete(`${enums_1.ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token_2}`);
        expect(res.status).toBe(enums_1.HttpStatus.FORBIDDEN);
    });
    it('POST /spaces should extract token from cookies', async () => {
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.SPACES}/`)
            .send(spaceData_2)
            .set('Cookie', [`jwt=${token_2}`]);
        expect(res.status).toBe(enums_1.HttpStatus.CREATED);
    });
});
//# sourceMappingURL=route-protector.spec.js.map