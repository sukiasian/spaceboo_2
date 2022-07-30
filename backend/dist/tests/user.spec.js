"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const path = require("path");
const user_model_1 = require("../models/user.model");
const lib_1 = require("./lib");
const enums_1 = require("../types/enums");
const space_model_1 = require("../models/space.model");
const appointment_model_1 = require("../models/appointment.model");
const city_model_1 = require("../models/city.model");
const storage_config_1 = require("../configurations/storage.config");
const user_sequelize_dao_1 = require("../daos/user.sequelize.dao");
describe('User (e2e)', () => {
    let app;
    let server;
    let appConfig;
    let db;
    let user_1;
    let user_2;
    let userData_1;
    let userData_2;
    let userDao;
    let token_1;
    let token_2;
    let userModel;
    let spaceData_1;
    let spaceModel;
    let space_1;
    let city;
    let cityModel;
    let appointmentModel;
    let pathToTestImage;
    let fakePassword;
    let fakeName;
    beforeAll(async () => {
        appConfig = lib_1.createAppConfig();
        app = appConfig.app;
        db = appConfig.sequelize;
        pathToTestImage = path.resolve('tests', 'files', 'images', '1.png');
        userModel = user_model_1.User;
        spaceModel = space_model_1.Space;
        cityModel = city_model_1.City;
        appointmentModel = appointment_model_1.Appointment;
        userDao = user_sequelize_dao_1.userSequelizeDao;
        userData_1 = lib_1.createUserData();
        userData_2 = lib_1.createUserData();
        fakePassword = 'fakepassword';
        fakeName = 'Петр';
        server = (await lib_1.openTestEnv(appConfig)).server;
    });
    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        user_1 = await userModel.create(userData_1);
        user_2 = await userModel.create(userData_2);
        spaceData_1 = lib_1.createSpaceData(user_1.id, city.id);
        space_1 = await spaceModel.create(spaceData_1, { include: [city_model_1.City] });
        space_1 = await spaceModel.findOne({
            where: { id: space_1.id },
            include: [city_model_1.City, appointment_model_1.Appointment],
        });
        token_1 = lib_1.createTokenAndSign({ id: user_1.id });
        token_2 = lib_1.createTokenAndSign({ id: user_2.id });
    });
    afterEach(async () => {
        lib_1.clearDbAndStorage(db);
    });
    afterAll(async () => {
        await lib_1.closeTestEnv(db, server);
    });
    it('POST /images/users should add avatarUrl to DB', async () => {
        expect(user_1.avatarUrl).toBeNull();
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users/`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(storage_config_1.StorageUploadFilenames.USER_AVATAR, pathToTestImage);
        const freshUser = await userDao.findById(user_1.id);
        expect(freshUser.avatarUrl).toBeDefined();
    });
    it('DELETE /images/users/ should remove avatarUrl from DB', async () => {
        expect(user_1.avatarUrl).toBeNull();
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users/`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(storage_config_1.StorageUploadFilenames.USER_AVATAR, pathToTestImage);
        const user = await userDao.findById(user_1.id);
        expect(user.avatarUrl).toBeDefined();
        await request(app)
            .delete(`${enums_1.ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token_1}`)
            .send({ userAvatarToRemove: user.avatarUrl });
        const freshUser = await userDao.findById(user_1.id);
        expect(freshUser.avatarUrl).toBeNull();
    });
    it('PUT /users should update user data', async () => {
        const res = await request(app)
            .put(`${enums_1.ApiRoutes.USERS}`)
            .set('Authorization', `Bearer ${token_1}`)
            .send({
            userEditData: {
                name: fakeName,
            },
        });
        expect(res.status).toBe(enums_1.HttpStatus.OK);
        const freshUser = await userDao.findById(user_1.id);
        expect(freshUser.name);
    });
    it("PUT /users should not be able to update user's role", async () => {
        const res = await request(app)
            .put(`${enums_1.ApiRoutes.USERS}`)
            .set('Authorization', `Bearer ${token_1}`)
            .send({
            userEditData: {
                role: user_model_1.UserRoles.ADMIN,
            },
        });
        const freshUser = await userModel.scope(user_model_1.UserScopes.WITH_PASSWORD).findOne({ where: { id: user_1.id } });
        expect(freshUser.role).toBe(user_model_1.UserRoles.USER);
    });
    it('PUT /auth/passwordChange passwords should match', async () => {
        const res_1 = await request(app)
            .put(`${enums_1.ApiRoutes.AUTH}/passwordChange`)
            .set('Authorization', `Bearer ${token_1}`)
            .send({
            passwordData: {
                password: fakePassword,
                passwordConfirmation: fakePassword.toUpperCase(),
                oldPassword: userData_1.password,
            },
        });
        expect(res_1.status).toBe(enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
        const res_2 = await request(app)
            .put(`${enums_1.ApiRoutes.AUTH}/passwordChange`)
            .set('Authorization', `Bearer ${token_1}`)
            .send({
            passwordData: {
                password: fakePassword,
                passwordConfirmation: fakePassword,
                oldPassword: userData_1.password,
            },
        });
        expect(res_2.status).toBe(enums_1.HttpStatus.OK);
    });
});
//# sourceMappingURL=user.spec.js.map