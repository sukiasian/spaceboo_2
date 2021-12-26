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
describe('Space (e2e)', () => {
    let app;
    let server;
    let applicationInstance;
    let db;
    let userData;
    let user;
    let userModel;
    let spaceData;
    let spaceData_2;
    let spaceModel;
    let city;
    let city_2;
    let cityModel;
    let appointmentModel;
    let token;
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
        city_2 = await cityModel.findOne({ where: { city: 'Краснодар' } });
        user = await userModel.create(userData);
        spaceData = lib_1.createSpaceData(user.id, city.id);
        spaceData_2 = lib_1.createSpaceData(user.id, city_2.id);
        token = await lib_1.createTokenAndSign(user.id);
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
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.SPACES}`)
            .send(spaceData)
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(enums_1.HttpStatus.CREATED);
        const spacesFresh = await spaceModel.findAll({ raw: true });
        expect(spacesFresh.length).toBeGreaterThan(0);
        expect(spacesFresh[0].userId).toBe(spaceData.userId);
    });
    it('Created appointments should relate to space', async () => {
        let space = await spaceModel.create(spaceData);
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [city_model_1.City, appointment_model_1.Appointment],
        });
        const isoDatesToReserve_1 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-15', '14:00', '2020-12-20', '12:00');
        const isoDatesToReserve_2 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2021-12-15', '14:00', '2021-12-20', '12:00');
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });
        expect(spaceFresh[enums_1.SequelizeModelProps.DATA_VALUES].appointments).toBeTruthy();
        expect(spaceFresh[enums_1.SequelizeModelProps.DATA_VALUES].appointments.length).toBe(2);
    });
    ///// 1️⃣
    it('GET /spaces should get all spaces by city', async () => {
        let space = await spaceModel.create(spaceData);
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [cityModel, appointmentModel],
        });
        let space_2 = await spaceModel.create(spaceData_2);
        space_2 = await spaceModel.findOne({ where: { id: space_2.id }, include: [cityModel, appointmentModel] });
        const datesToReserve_1 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-15', '14:00', '2020-12-20', '12:00');
        const datesToReserve_2 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2021-12-15', '14:00', '2021-12-20', '12:00');
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: datesToReserve_2,
        });
        const res = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            city: space_2.city[enums_1.SequelizeModelProps.DATA_VALUES]['city'],
        });
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].city.city).toBe(space_2.city[enums_1.SequelizeModelProps.DATA_VALUES]['city']);
    });
    ///// 2️⃣
    it('GET /spaces should get all spaces by dates to reserve', async () => {
        let space = await spaceModel.create(spaceData);
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [cityModel, appointmentModel],
        });
        let space_2 = await spaceModel.create(spaceData_2);
        space_2 = await spaceModel.findOne({ where: { id: space_2.id }, include: [cityModel, appointmentModel] });
        const datesToReserve_1 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-15', '14:00', '2020-12-20', '12:00');
        const datesToReserve_2 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2021-12-15', '14:00', '2021-12-20', '12:00');
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: datesToReserve_2,
        });
        const res = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2025-12-15,2025-12-20',
            timesToReserveQuery: '10:00,12:00',
        });
        console.log(res.body.data, 'resssssss');
        console.log(res.body.data[0].appointments[0].isoDatesReserved, '1111111');
        console.log(res.body.data[1].appointments[0].isoDatesReserved, '2222222');
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].id).toBe(space_2.id); // FIXME здесь должно быть space_2!!!!!!!!!!!!!!
    });
    ///// 3️⃣
    it('GET /spaces should get all spaces without query strings', async () => {
        let space = await spaceModel.create(spaceData);
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [cityModel, appointmentModel],
        });
        let space_2 = await spaceModel.create(spaceData);
        space_2 = await spaceModel.findOne({ where: { id: space.id }, include: [cityModel, appointmentModel] });
        const datesToReserve_1 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-15', '14:00', '2020-12-20', '12:00');
        const datesToReserve_2 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2021-12-15', '14:00', '2021-12-20', '12:00');
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: datesToReserve_2,
        });
        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });
        const res = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2020-12-15,2020-12-20',
            timesToReserveQuery: '13:00,12:00',
            city: space.city[enums_1.SequelizeModelProps.DATA_VALUES]['city'],
        });
    });
    ///// 4️⃣
    it('GET /spaces should get all spaces with city and dates to reserve queries', async () => {
        let space = await spaceModel.create(spaceData);
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [cityModel, appointmentModel],
        });
        let space_2 = await spaceModel.create(spaceData);
        space_2 = await spaceModel.findOne({ where: { id: space.id }, include: [cityModel, appointmentModel] });
        const datesToReserve_1 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-15', '14:00', '2020-12-20', '12:00');
        const datesToReserve_2 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2021-12-15', '14:00', '2021-12-20', '12:00');
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: datesToReserve_2,
        });
        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });
        const res = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2020-12-15,2020-12-20',
            timesToReserveQuery: '13:00,12:00',
            city: space.city[enums_1.SequelizeModelProps.DATA_VALUES]['city'],
        });
        const appointment = await appointmentModel.findOne();
    });
    ///// 5️⃣
    it('GET /spaces should get all spaces should be able to sort', async () => {
        let space = await spaceModel.create(spaceData);
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [cityModel, appointmentModel],
        });
        let space_2 = await spaceModel.create(spaceData);
        space_2 = await spaceModel.findOne({ where: { id: space.id }, include: [cityModel, appointmentModel] });
        const datesToReserve_1 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-15', '14:00', '2020-12-20', '12:00');
        const datesToReserve_2 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2021-12-15', '14:00', '2021-12-20', '12:00');
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: datesToReserve_2,
        });
        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });
        const res = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2020-12-15,2020-12-20',
            timesToReserveQuery: '13:00,12:00',
            city: space.city[enums_1.SequelizeModelProps.DATA_VALUES]['city'],
        });
    });
    it('PUT /spaces should edit space by id', async () => { });
    it('DELETE /spaces should delete space from database', async () => { });
    it('Created appointments should relate to space', async () => {
        let space = await spaceModel.create(spaceData);
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [city_model_1.City, appointment_model_1.Appointment],
        });
        const isoDatesToReserve_1 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-15', '14:00', '2020-12-20', '12:00');
        const isoDatesToReserve_2 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2021-12-15', '14:00', '2021-12-20', '12:00');
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });
        expect(spaceFresh[enums_1.SequelizeModelProps.DATA_VALUES].appointments).toBeTruthy();
        expect(spaceFresh[enums_1.SequelizeModelProps.DATA_VALUES].appointments.length).toBe(2);
        // NOTE перед записью аппоинтмента нужно проверить чтобы время было свободно
    });
});
//# sourceMappingURL=space.spec.js.map