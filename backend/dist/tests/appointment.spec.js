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
    let appConfig;
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
    let resIsoDatesToReserve;
    let resIsoDatesToReserveNarrow;
    let resIsoDatesToReserveWide;
    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });
        appConfig = (0, lib_1.createAppConfig)();
        app = appConfig.app;
        db = appConfig.sequelize;
        userModel = user_model_1.User;
        spaceModel = space_model_1.Space;
        cityModel = city_model_1.City;
        appointmentModel = appointment_model_1.Appointment;
        userData = (0, lib_1.createUserData)();
        resIsoDatesToReserve = {
            beginningDate: '2020-12-15',
            beginningTime: '14:00',
            endingDate: '2020-12-20',
            endingTime: '12:00',
        };
        resIsoDatesToReserveNarrow = {
            beginningDate: '2020-12-17',
            beginningTime: '14:00',
            endingDate: '2020-12-19',
            endingTime: '12:00',
        };
        resIsoDatesToReserveWide = {
            beginningDate: '2020-12-12',
            beginningTime: '14:00',
            endingDate: '2020-12-25',
            endingTime: '12:00',
        };
        server = (await (0, lib_1.openTestEnv)(appConfig)).server;
    });
    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        user = await userModel.create(userData);
        spaceData = (0, lib_1.createSpaceData)(user.id, city.id);
        space = await spaceModel.create(spaceData, { include: [city_model_1.City] });
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [city_model_1.City, appointment_model_1.Appointment],
        });
        token = (0, lib_1.createTokenAndSign)({ id: user.id });
        /*
            TODO: здесь мы создаем напрямую. если у нас стоят валидаторы у модели то здесь мы не должны суметь создавать записи на время
            которое меньше чем дата сейчас.

            Мы можем сделать это напрямую в endpoint-e и возможно так будет даже лучше.
        */
    });
    afterEach(async () => {
        (0, lib_1.clearDb)(db);
    });
    afterAll(async () => {
        await (0, lib_1.closeTestEnv)(db, server);
    });
    it('POST /appointments should create an appointment', async () => {
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            resIsoDatesToReserve,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(enums_1.HttpStatus.CREATED);
    });
    it('POST /appointments should not create an appointment if the space is unavailable', async () => {
        const appointments = await appointmentModel.count({ where: { spaceId: space.id } });
        expect(appointments).toBe(0);
        await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            resIsoDatesToReserve,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        const res_1 = await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            resIsoDatesToReserve,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        expect(res_1.status).toBe(enums_1.HttpStatus.FORBIDDEN);
        const res_2 = await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            resIsoDatesToReserve: resIsoDatesToReserveNarrow,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        expect(res_2.status).toBe(enums_1.HttpStatus.FORBIDDEN);
        const res_3 = await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            resIsoDatesToReserve: resIsoDatesToReserveWide,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        expect(res_3.status).toBe(enums_1.HttpStatus.FORBIDDEN);
    });
    it('POST /appointments should parse timezones properly and store appointments in +0 timezone', async () => {
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            resIsoDatesToReserve,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        expect(res.body.data.isoDatesReserved).toStrictEqual([
            { inclusive: true, value: '2020-12-15T14:00:00.000Z' },
            { inclusive: false, value: '2020-12-20T12:00:00.000Z' },
        ]);
    });
    it('POST /appointments should check if date is not in the past', async () => { });
    it('GET /appointments should get appointments by required dates', async () => {
        await request(app)
            .post(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            resIsoDatesToReserve,
            spaceId: space.id,
        })
            .set('Authorization', `Bearer ${token}`);
        const res = await request(app)
            .get(`${enums_1.ApiRoutes.APPOINTMENTS}`)
            .send({
            requiredDates: "'[2020-12-01, 2020-12-31]'",
        })
            .set('Authorization', `Bearer ${token}`);
    });
});
//# sourceMappingURL=appointment.spec.js.map