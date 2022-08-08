"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const lib_1 = require("./lib");
const user_model_1 = require("../models/user.model");
const space_model_1 = require("../models/space.model");
const appointment_model_1 = require("../models/appointment.model");
const city_model_1 = require("../models/city.model");
const enums_1 = require("../types/enums");
const storage_config_1 = require("../configurations/storage.config");
describe('NodeCronjob (e2e)', () => {
    let app;
    let server;
    let appConfig;
    let sequelize;
    let nodeCronFunctions;
    let userModel;
    let user_1;
    let user_2;
    let userData_1;
    let userData_2;
    let token_1;
    let token_2;
    let spaceModel;
    let appointmentModel;
    let cityModel;
    let city;
    let pathToTestImage_1;
    let pathToTestImage_2;
    let isoDatesReserved_1;
    let isoDatesReserved_2;
    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });
        appConfig = lib_1.createAppConfig();
        nodeCronFunctions = lib_1.createNodeCronFunctions();
        userModel = user_model_1.User;
        spaceModel = space_model_1.Space;
        appointmentModel = appointment_model_1.Appointment;
        cityModel = city_model_1.City;
        userData_1 = lib_1.createUserData();
        userData_2 = lib_1.createUserData();
        pathToTestImage_1 = path.resolve('tests', 'files', 'images', '1.png');
        pathToTestImage_2 = path.resolve('tests', 'files', 'images', '2.jpeg');
        isoDatesReserved_1 = [
            {
                inclusive: true,
                value: '2020-01-01T14:00:00.000Z',
            },
            {
                inclusive: true,
                value: '2020-02-01T14:00:00.000Z',
            },
        ];
        isoDatesReserved_2 = [
            {
                inclusive: true,
                value: '2020-01-01T14:00:00.000Z',
            },
            {
                inclusive: true,
                value: '2050-02-01T14:00:00.000Z',
            },
        ];
        app = appConfig.app;
        sequelize = appConfig.sequelize;
        server = (await lib_1.openTestEnv(appConfig)).server;
    });
    beforeEach(async () => {
        city = await cityModel.findOne();
        user_1 = await userModel.create(userData_1);
        user_2 = await userModel.create(userData_2);
        token_1 = jwt.sign({ id: user_1.id }, process.env.JWT_SECRET_KEY);
        token_2 = jwt.sign({ id: user_2.id }, process.env.JWT_SECRET_KEY);
    });
    afterEach(async () => {
        lib_1.clearDb(sequelize);
    });
    afterAll(async () => {
        await lib_1.clearDbAndStorage(sequelize);
        await lib_1.closeTestEnv(sequelize, server);
    });
    it('Function "archiveOutdatedAppointments" should set all appointments\' "archived" property to true', async () => {
        const spaceData_1 = lib_1.createSpaceData(user_1.id, city.id);
        const space_1 = await spaceModel.create(spaceData_1);
        const appointmentData_1 = lib_1.createAppoinmentData(isoDatesReserved_1, space_1.id, user_1.id);
        const appointmentForSpace_1 = await appointmentModel.create(appointmentData_1);
        const spaceData_2 = lib_1.createSpaceData(user_2.id, city.id);
        const space_2 = await spaceModel.create(spaceData_2);
        const appointmentData_2 = lib_1.createAppoinmentData(isoDatesReserved_2, space_2.id, user_2.id);
        const appointmentForSpace_2 = await appointmentModel.create(appointmentData_2);
        expect(appointmentForSpace_1.archived).toBeFalsy();
        expect(appointmentForSpace_2.archived).toBeFalsy();
        await nodeCronFunctions.archiveOutdatedAppointments();
        const freshAppointmentForSpace_1 = await appointmentModel.findOne({
            where: {
                id: appointmentForSpace_1.id,
            },
        });
        expect(freshAppointmentForSpace_1.archived).toBeTruthy();
    });
    it('Function "removeOutdatedUserAvatarsFromStorage" should remove outdated user avatars according to avatarUrl', async () => {
        let responseForUploadingImageForUser_1;
        let responseForUploadingImageForUser_2;
        responseForUploadingImageForUser_1 = await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(storage_config_1.StorageUploadFilenames.USER_AVATAR, pathToTestImage_1);
        const outdatedAvatarUrlForUser_1 = (await userModel.findOne({
            where: {
                id: user_1.id,
            },
        })).avatarUrl;
        expect(fs.existsSync(path.resolve('assets/images', outdatedAvatarUrlForUser_1))).toBeTruthy();
        responseForUploadingImageForUser_1 = await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(storage_config_1.StorageUploadFilenames.USER_AVATAR, pathToTestImage_2);
        responseForUploadingImageForUser_2 = await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token_2}`)
            .attach(storage_config_1.StorageUploadFilenames.USER_AVATAR, pathToTestImage_1);
        const outdatedAvatarUrlForUser_2 = (await userModel.findOne({
            where: {
                id: user_2.id,
            },
        })).avatarUrl;
        expect(fs.existsSync(path.resolve('assets/images', outdatedAvatarUrlForUser_2))).toBeTruthy();
        responseForUploadingImageForUser_2 = await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token_2}`)
            .attach(storage_config_1.StorageUploadFilenames.USER_AVATAR, pathToTestImage_2);
        nodeCronFunctions.removeOutdatedUserAvatarsFromStorage();
        const checkIfOutdatedAvatarExistsForUser_1 = fs.existsSync(outdatedAvatarUrlForUser_1);
        const checkIfOutdatedAvatarExistsForUser_2 = fs.existsSync(outdatedAvatarUrlForUser_2);
        expect(checkIfOutdatedAvatarExistsForUser_1).toBeFalsy();
        expect(checkIfOutdatedAvatarExistsForUser_2).toBeFalsy();
    });
    it('Function "removeOutdatedSpaceImagesFromStorage" should remove outdated space images according to avatarUrl', async () => {
        const spaceData_1 = lib_1.createSpaceData(user_1.id, city.id, 1000);
        const spaceData_2 = lib_1.createSpaceData(user_2.id, city.id, 1000);
        const configureRequestForSpace = (request) => {
            let req = request.post(enums_1.ApiRoutes.SPACES);
            for (const field in spaceData_1) {
                req = req.field(field, spaceData_1[field]);
            }
            req.set('Authorization', `Bearer ${token_1}`).attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage_2);
            return req;
        };
        const space_1 = await configureRequestForSpace(request(app));
        const responseForEditingSpace_1 = await request(app)
            .put(`ApiRoutes.SPACES/${space_1}`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage_2);
        const freshSpace_1 = await spaceModel.findOne({
            where: {
                id: space_1.body.data.id,
            },
        });
    });
    it('Function "removeOutdatedEmailsFromDb" should remove outdated space images according to avatarUrl', async () => {
        const spaceData_1 = lib_1.createSpaceData(user_1.id, city.id, 1000);
        const spaceData_2 = lib_1.createSpaceData(user_2.id, city.id, 1000);
        const space_1 = await request(app)
            .post(enums_1.ApiRoutes.SPACES)
            .send(spaceData_1)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage_1);
        const space_2 = await request(app)
            .post(enums_1.ApiRoutes.SPACES)
            .send(spaceData_2)
            .set('Authorization', `Bearer ${token_2}`)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage_1);
        const responseForEditingSpace_1 = await request(app)
            .put(`ApiRoutes.SPACES/${space_1}`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage_2);
    });
});
//# sourceMappingURL=node-cron-function.spec.js.map