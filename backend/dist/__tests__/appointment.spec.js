"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const dotenv = require("dotenv");
const user_model_1 = require("../models/user.model");
const lib_1 = require("./lib");
const enums_1 = require("../types/enums");
const space_model_1 = require("../models/space.model");
const appointment_model_1 = require("../models/appointment.model");
const city_model_1 = require("../models/city.model");
describe('Appointment (e2e)', () => {
    let app;
    let server;
    let applicationInstance;
    let db;
    let userData;
    let user;
    let token;
    let userModel;
    let spaceData;
    let spaceModel;
    let city;
    let cityModel;
    let space;
    let appointmentModel;
    let beginningDate;
    let endingDate;
    let datesToReserve;
    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });
        applicationInstance = lib_1.createApplicationInstance();
        app = applicationInstance.app;
        db = applicationInstance.sequelize;
        userModel = user_model_1.User;
        spaceModel = space_model_1.Space;
        cityModel = city_model_1.City;
        appointmentModel = appointment_model_1.Appointment;
        userData = lib_1.createUserData();
        server = (await lib_1.openTestEnv(applicationInstance)).server;
    });
    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        user = await userModel.create(userData);
        spaceData = lib_1.createSpaceData(user.id, city.id);
        space = await spaceModel.create(spaceData, { include: [{ model: city_model_1.City, as: 'city' }] });
        space = await spaceModel.findOne({
            where: { id: space.id },
            raw: true,
            include: [{ model: city_model_1.City, as: 'city' }],
        });
        beginningDate = lib_1.createCustomDate('2020-12-15', space['city.timezone']);
        endingDate = lib_1.createCustomDate('2020-12-20', space['city.timezone']);
        datesToReserve = [
            { inclusive: true, value: beginningDate },
            { inclusive: false, value: endingDate },
        ];
        token = await lib_1.createTokenAndSign(user.id);
    });
    afterEach(async () => {
        lib_1.clearDb(db);
    });
    afterAll(async () => {
        await lib_1.closeTestEnv(db, server);
    });
    it('POST /appointments should create an appointment', async () => {
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            datesToReserve,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(enums_1.HttpStatus.CREATED);
    });
    it('POST /appointments should parse timezones properly and store appointments in +0 timezone', async () => {
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            datesToReserve,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        expect(res.body.data.datesReserved).toStrictEqual([
            { inclusive: true, value: '2020-12-15T00:00:00.000Z' },
            { inclusive: false, value: '2020-12-20T00:00:00.000Z' },
        ]);
    });
    it('POST /appointments should not allow to register if a space is unavailable', async () => { });
});
//# sourceMappingURL=appointment.spec.js.map