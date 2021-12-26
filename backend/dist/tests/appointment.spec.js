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
const UtilFunctions_1 = require("../utils/UtilFunctions");
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
    let isoDatesToReserve;
    let isoDatesToReserveNarrow;
    let isoDatesToReserveWide;
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
        space = await spaceModel.create(spaceData, { include: [city_model_1.City] });
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [city_model_1.City, appointment_model_1.Appointment],
        });
        isoDatesToReserve = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-15', '14:00', '2020-12-20', '12:00');
        isoDatesToReserveNarrow = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-17', '14:00', '2020-12-19', '12:00');
        isoDatesToReserveWide = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-10', '14:00', '2020-12-24', '12:00');
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
            isoDatesToReserve,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(enums_1.HttpStatus.CREATED);
    });
    it('POST /appointments should parse timezones properly and store appointments in +0 timezone', async () => {
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            isoDatesToReserve,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        expect(res.body.data.isoDatesReserved).toStrictEqual([
            { inclusive: true, value: '2020-12-15T14:00:00.000Z' },
            { inclusive: false, value: '2020-12-20T12:00:00.000Z' },
        ]);
    });
    it('POST /appointments should not allow to register if a space is unavailable (range contains)', async () => {
        // TODO refactor from using request to using model directly
        await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({ isoDatesToReserve, spaceId: space.id })
            .set('Authorization', `Bearer ${token}`);
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({ isoDatesToReserve: isoDatesToReserveWide, spaceId: space.id })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(enums_1.HttpStatus.FORBIDDEN);
    });
    it('POST /appointments should not allow to register if a space is unavailable (range is contained)', async () => {
        await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({ isoDatesToReserve, spaceId: space.id })
            .set('Authorization', `Bearer ${token}`);
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({ isoDatesToReserve: isoDatesToReserveNarrow, spaceId: space.id })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(enums_1.HttpStatus.FORBIDDEN);
    });
});
//# sourceMappingURL=appointment.spec.js.map