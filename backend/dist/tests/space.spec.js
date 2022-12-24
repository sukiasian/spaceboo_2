"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const dotenv = require("dotenv");
const path = require("path");
const faker = require("faker");
const user_model_1 = require("../models/user.model");
const lib_1 = require("./lib");
const enums_1 = require("../types/enums");
const space_model_1 = require("../models/space.model");
const appointment_model_1 = require("../models/appointment.model");
const city_model_1 = require("../models/city.model");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const space_sequelize_dao_1 = require("../daos/space.sequelize.dao");
const storage_config_1 = require("../configurations/storage.config");
describe('Space (e2e)', () => {
    let app;
    let server;
    let appConfig;
    let db;
    let userData;
    let user;
    let userModel;
    let spaceData;
    let spaceData_2;
    let spaceModel;
    let spaceDao;
    let city;
    let city_2;
    let cityModel;
    let appointmentModel;
    let token;
    let isoDatesToReserve_1;
    let isoDatesToReserve_2;
    let isoDatesToReserve_3;
    let space_1;
    let space_2;
    let pathToTestImage;
    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });
        isoDatesToReserve_1 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2020-12-15', '14:00', '2020-12-20', '12:00');
        isoDatesToReserve_2 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2021-12-15', '14:00', '2021-12-20', '12:00');
        isoDatesToReserve_3 = UtilFunctions_1.default.createIsoDatesRangeToCreateAppointments('2022-12-15', '14:00', '2022-12-20', '12:00');
        appConfig = (0, lib_1.createAppConfig)();
        pathToTestImage = path.resolve('tests', 'files', 'images', '1.png');
        app = appConfig.app;
        db = appConfig.sequelize;
        spaceDao = space_sequelize_dao_1.spaceSequelizeDao;
        userModel = user_model_1.User;
        spaceModel = space_model_1.Space;
        cityModel = city_model_1.City;
        appointmentModel = appointment_model_1.Appointment;
        userData = (0, lib_1.createUserData)();
        server = (await (0, lib_1.openTestEnv)(appConfig)).server;
    });
    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        city_2 = await cityModel.findOne({ where: { name: 'Краснодар' } });
        user = await userModel.create(userData);
        spaceData = (0, lib_1.createSpaceData)(user.id, city.id, 1500);
        spaceData_2 = (0, lib_1.createSpaceData)(user.id, city_2.id);
        token = (0, lib_1.createTokenAndSign)({ id: user.id });
        space_1 = await spaceModel.create(spaceData);
        space_1 = await spaceModel.findOne({
            where: { id: space_1.id },
            include: [cityModel, appointmentModel],
        });
        space_2 = await spaceModel.create(spaceData_2);
        space_2 = await spaceModel.findOne({ where: { id: space_2.id }, include: [cityModel, appointmentModel] });
    });
    afterEach(async () => {
        (0, lib_1.clearDb)(db);
        userData = (0, lib_1.createUserData)();
    });
    afterAll(async () => {
        await (0, lib_1.closeTestEnv)(db, server);
    });
    it('POST /spaces should create a space', async () => {
        await spaceModel.destroy({ truncate: true, cascade: true });
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
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        const spaceFresh = await spaceModel.findOne({
            where: { id: space_1.id },
            include: { all: true },
            nest: true,
        });
        expect(spaceFresh[enums_1.SequelizeModelProps.DATA_VALUES].appointments).toBeTruthy();
        expect(spaceFresh[enums_1.SequelizeModelProps.DATA_VALUES].appointments.length).toBe(2);
    });
    it('GET /spaces should get all spaces by city', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        const res = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            cityId: space_2.cityId,
        });
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].cityId).toBe(space_2.cityId);
    });
    it('GET /spaces should get all spaces by price range', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        const res_1 = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            priceRange: '10000',
        });
        expect(res_1.body.data.length).toBe(0);
        const res_2 = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            priceRange: '500',
        });
        expect(res_2.body.data.length).toBe(2);
        const res_3 = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            priceRange: '500,0',
        });
        expect(res_3.body.data.length).toBe(0);
    });
    it('GET /spaces should get all spaces by dates to reserve', async () => {
        // FIXME if appointment already overlaps then we should be unable to create a new one
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_3,
        });
        const res = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2020-12-15,2020-12-20',
            timesToReserveQuery: '13:00,12:00',
        });
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].id).toBe(space_2.id);
    });
    it('GET /spaces should get all spaces without query strings', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        const res = await request(app).get(`${enums_1.ApiRoutes.SPACES}`);
        expect(res.body.data.length).toBe(2);
    });
    it('GET /spaces should get all spaces with city and dates to reserve queries', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        const res_1 = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2025-12-15,2025-12-20',
            timesToReserveQuery: '13:00,12:00',
            cityId: space_1.cityId,
        });
        const res_2 = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2025-12-15,2025-12-20',
            timesToReserveQuery: '13:00,12:00',
            cityId: space_2.cityId,
        });
        const res_3 = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2020-12-15,2020-12-20',
            timesToReserveQuery: '13:00,12:00',
            cityId: space_1.cityId,
        });
        expect(res_1.body.data.length).toBe(1);
        expect(res_2.body.data.length).toBe(1);
        expect(res_3.body.data.length).toBe(0);
    });
    it('GET /spaces should get all spaces should be able to sort', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        const res_1 = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            sortBy: space_sequelize_dao_1.SpaceQuerySortFields.PRICEUP,
        });
        expect(res_1.body.data[0].pricePerNight < res_1.body.data[1].pricePerNight);
        const res_2 = await request(app).get(`${enums_1.ApiRoutes.SPACES}`).query({
            sortBy: space_sequelize_dao_1.SpaceQuerySortFields.PRICEDOWN,
        });
        expect(res_2.body.data[0].pricePerNight > res_2.body.data[1].pricePerNight);
    });
    it('DELETE /spaces should delete space from database', async () => { });
    it('Created appointments should relate to space', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        const spaceFresh = await spaceModel.findOne({
            where: { id: space_1.id },
            include: { all: true },
            nest: true,
        });
        expect(spaceFresh[enums_1.SequelizeModelProps.DATA_VALUES].appointments).toBeTruthy();
        expect(spaceFresh[enums_1.SequelizeModelProps.DATA_VALUES].appointments.length).toBe(2);
    });
    it('POST /images/spaces/:spaceId should add imagesUrl to DB', async () => {
        expect(space_1.imagesUrl.length).toBeLessThanOrEqual(1);
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage);
        const freshSpace = await spaceDao.findById(space_1.id);
        expect(freshSpace.imagesUrl.length).toBe(2);
    });
    it('DELETE /images/spaces/:spaceId should remove imagesUrl from DB', async () => {
        expect(space_1.imagesUrl.length).toBe(1);
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage);
        const space = await spaceDao.findById(space_1.id);
        expect(space.imagesUrl.length).toBe(5);
        await request(app)
            .delete(`${enums_1.ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ spaceImagesToRemove: space.imagesUrl });
        const freshSpace = await spaceDao.findById(space_1.id);
        expect(freshSpace.imagesUrl.length).toBe(0);
    });
    it('PUT /spaces/:spaceId should update space data', async () => {
        const roomsNumber = faker.datatype.number(100);
        const res = await request(app)
            .put(`${enums_1.ApiRoutes.SPACES}/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
            spaceEditData: {
                roomsNumber,
            },
        });
        expect(res.status).toBe(enums_1.HttpStatus.OK);
        const space = await spaceDao.findById(space_1.id);
        expect(space.roomsNumber).toBe(roomsNumber);
    });
    it('DELETE /spaces/:spaceId should remove space from DB', async () => {
        const space = await spaceDao.findById(space_1.id);
        expect(space).toBeDefined();
        await request(app).delete(`${enums_1.ApiRoutes.SPACES}/${space_1.id}`).set('Authorization', `Bearer ${token}`);
        const freshSpace = await spaceDao.findById(space_1.id);
    });
    it("GET /spaces/user/outdated should get user's outdated appointments", async () => {
        const outdatedAppointmentDataForSpace_1 = (0, lib_1.createAppoinmentData)([
            { value: '2020-01-01T14:00:00.000Z', inclusive: true },
            { value: '2020-01-05T12:00:00.000Z', inclusive: false },
        ], space_1.id, user.id);
        const activeAppointmentDataForSpace_2 = (0, lib_1.createAppoinmentData)([
            { value: new Date().toISOString(), inclusive: true },
            { value: new Date(Date.now() + 100000000).toISOString(), inclusive: false },
        ], space_2.id, user.id);
        const upcomingAppointmentDataForSpace_2 = (0, lib_1.createAppoinmentData)([
            { value: '2050-01-01T14:00:00.000Z', inclusive: true },
            { value: '2050-01-05T12:00:00.000Z', inclusive: false },
        ], space_2.id, user.id);
        await appointmentModel.create(outdatedAppointmentDataForSpace_1);
        await appointmentModel.create(activeAppointmentDataForSpace_2);
        await appointmentModel.create(upcomingAppointmentDataForSpace_2);
        const userAppointments = await appointmentModel.findAll({
            where: {
                userId: user.id,
            },
        });
        expect(userAppointments.length).toBe(3);
        const res = await request(app)
            .get(`${enums_1.ApiRoutes.SPACES}/appointed/outdated`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].id).toBe(space_1.id);
    });
    it("GET /spaces/user/active should get user's active appointments", async () => {
        const outdatedAppointmentDataForSpace_1 = (0, lib_1.createAppoinmentData)([
            { value: '2020-01-01T14:00:00.000Z', inclusive: true },
            { value: '2020-01-05T12:00:00.000Z', inclusive: false },
        ], space_1.id, user.id);
        const upcomingAppointmentDataForSpace_1 = (0, lib_1.createAppoinmentData)([
            { value: '2050-01-01T14:00:00.000Z', inclusive: true },
            { value: '2050-01-05T12:00:00.000Z', inclusive: false },
        ], space_1.id, user.id);
        const activeAppointmentDataForSpace_2 = (0, lib_1.createAppoinmentData)([
            { value: new Date().toISOString(), inclusive: true },
            { value: new Date(Date.now() + 100000000).toISOString(), inclusive: false },
        ], space_2.id, user.id);
        await appointmentModel.create(outdatedAppointmentDataForSpace_1);
        await appointmentModel.create(upcomingAppointmentDataForSpace_1);
        await appointmentModel.create(activeAppointmentDataForSpace_2);
        const userAppointments = await appointmentModel.findAll({
            where: {
                userId: user.id,
            },
        });
        expect(userAppointments.length).toBe(3);
        const res = await request(app)
            .get(`${enums_1.ApiRoutes.SPACES}/appointed/active`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].id).toBe(space_2.id);
    });
    it("GET /spaces/user/upcoming should get user's upcoming appointments", async () => {
        const outdatedAppointmentDataForSpace_1 = (0, lib_1.createAppoinmentData)([
            { value: '2020-01-01T14:00:00.000Z', inclusive: true },
            { value: '2020-01-05T12:00:00.000Z', inclusive: false },
        ], space_1.id, user.id);
        const activeAppointmentDataForSpace_1 = (0, lib_1.createAppoinmentData)([
            { value: new Date().toISOString(), inclusive: true },
            { value: new Date(Date.now() + 100000000).toISOString(), inclusive: false },
        ], space_1.id, user.id);
        const upcomingAppointmentDataForSpace_2 = (0, lib_1.createAppoinmentData)([
            { value: '2050-01-01T14:00:00.000Z', inclusive: true },
            { value: '2050-01-05T12:00:00.000Z', inclusive: false },
        ], space_2.id, user.id);
        await appointmentModel.create(outdatedAppointmentDataForSpace_1);
        await appointmentModel.create(activeAppointmentDataForSpace_1);
        await appointmentModel.create(upcomingAppointmentDataForSpace_2);
        const userAppointments = await appointmentModel.findAll({
            where: {
                userId: user.id,
            },
        });
        expect(userAppointments.length).toBe(3);
        const res = await request(app)
            .get(`${enums_1.ApiRoutes.SPACES}/appointed/upcoming`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].id).toBe(space_2.id);
    });
});
//# sourceMappingURL=space.spec.js.map