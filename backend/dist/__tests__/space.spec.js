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
describe('Space (e2e)', () => {
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
        appointmentModel = appointment_model_1.Appointment;
        userData = lib_1.createUserData();
        server = (await lib_1.openTestEnv(applicationInstance)).server;
    });
    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        user = await userModel.create(userData);
        spaceData = lib_1.createSpaceData(user.id, city.id);
    });
    afterEach(async () => {
        lib_1.clearDb(db);
        userData = lib_1.createUserData();
    });
    afterAll(async () => {
        await lib_1.closeTestEnv(db, server);
    });
    it('POST /spaces should create a space', async () => {
        const spaces = await spaceModel.findAll({ raw: true });
        expect(spaces.length).toBe(0);
        const res = await request(app).post(`${enums_1.ApiRoutes.SPACES}`).send(spaceData);
        expect(res.status).toBe(enums_1.HttpStatus.CREATED);
        const spacesFresh = await spaceModel.findAll({ raw: true });
        expect(spacesFresh.length).toBeGreaterThan(0);
        expect(spacesFresh[0].userId).toBe(spaceData.userId);
    });
    it('GET /spaces should get all spaces by query', async () => {
        let space = await spaceModel.create(spaceData);
        space = await spaceModel.findOne({
            where: { id: space.id },
            raw: true,
            include: [
                { model: city_model_1.City, as: 'city' },
                { model: appointment_model_1.Appointment, as: 'appointments' },
            ],
        });
        const beginningDate_1 = lib_1.createCustomDate('2020-12-15', space['city.timezone']);
        const endingDate_1 = lib_1.createCustomDate('2020-12-20', space['city.timezone']);
        const beginningDate_2 = lib_1.createCustomDate('2021-12-15', space['city.timezone']);
        const endingDate_2 = lib_1.createCustomDate('2021-12-20', space['city.timezone']);
        const datesReserved_1 = [
            { inclusive: true, value: beginningDate_1 },
            { inclusive: false, value: endingDate_1 },
        ];
        const datesReserved_2 = [
            { inclusive: true, value: beginningDate_2 },
            { inclusive: false, value: endingDate_2 },
        ];
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            datesReserved: datesReserved_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            datesReserved: datesReserved_2,
        });
        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });
        expect(spaceFresh['dataValues'].appointments).toBeTruthy();
        expect(spaceFresh['dataValues'].appointments.length).toBe(2);
        const res = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({ datesToReserve: datesReserved_1 });
    });
    it('PUT /spaces should edit space by id', async () => { });
    it('DELETE /spaces should delete space from database', async () => { });
    it('Created appointments should relate to space', async () => {
        let space = await spaceModel.create(spaceData);
        space = await spaceModel.findOne({
            where: { id: space.id },
            raw: true,
            include: [
                { model: city_model_1.City, as: 'city' },
                { model: appointment_model_1.Appointment, as: 'appointments' },
            ],
        });
        const beginningDate_1 = lib_1.createCustomDate('2020-12-15', space['city.timezone']);
        const endingDate_1 = lib_1.createCustomDate('2020-12-20', space['city.timezone']);
        const beginningDate_2 = lib_1.createCustomDate('2021-12-15', space['city.timezone']);
        const endingDate_2 = lib_1.createCustomDate('2021-12-20', space['city.timezone']);
        const datesReserved_1 = [
            { inclusive: true, value: beginningDate_1 },
            { inclusive: false, value: endingDate_1 },
        ];
        const datesReserved_2 = [
            { inclusive: true, value: beginningDate_2 },
            { inclusive: false, value: endingDate_2 },
        ];
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            datesReserved: datesReserved_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            datesReserved: datesReserved_2,
        });
        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });
        expect(spaceFresh['dataValues'].appointments).toBeTruthy();
        expect(spaceFresh['dataValues'].appointments.length).toBe(2);
        // NOTE перед записью аппоинтмента нужно проверить чтобы время было свободно
    });
});
//# sourceMappingURL=space.spec.js.map