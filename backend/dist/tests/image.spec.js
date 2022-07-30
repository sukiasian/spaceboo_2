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
const UtilFunctions_1 = require("../utils/UtilFunctions");
const storage_config_1 = require("../configurations/storage.config");
const space_sequelize_dao_1 = require("../daos/space.sequelize.dao");
const user_sequelize_dao_1 = require("../daos/user.sequelize.dao");
describe('Image (e2e)', () => {
    let app;
    let server;
    let appConfig;
    let db;
    let user;
    let userData;
    let userModel;
    let userDao;
    let spaceData;
    let spaceData_2;
    let spaceDao;
    let spaceModel;
    let city;
    let city_2;
    let cityModel;
    let appointmentModel;
    let token;
    let space_1;
    let space_2;
    let pathToTestImage;
    beforeAll(async () => {
        appConfig = lib_1.createAppConfig();
        app = appConfig.app;
        db = appConfig.sequelize;
        pathToTestImage = path.resolve('tests', 'files', 'images', '1.png');
        spaceDao = space_sequelize_dao_1.spaceSequelizeDao;
        userDao = user_sequelize_dao_1.userSequelizeDao;
        userModel = user_model_1.User;
        spaceModel = space_model_1.Space;
        cityModel = city_model_1.City;
        appointmentModel = appointment_model_1.Appointment;
        userData = lib_1.createUserData();
        server = (await lib_1.openTestEnv(appConfig)).server;
    });
    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        city_2 = await cityModel.findOne({ where: { name: 'Краснодар' } });
        user = await userModel.create(userData);
        spaceData = lib_1.createSpaceData(user.id, city.id, 1500);
        spaceData_2 = lib_1.createSpaceData(user.id, city_2.id);
        token = await lib_1.createTokenAndSign({ id: user.id });
        space_1 = await spaceModel.create(spaceData);
        space_1 = await spaceModel.findOne({
            where: { id: space_1.id },
            include: [cityModel, appointmentModel],
        });
        space_2 = await spaceModel.create(spaceData_2);
        space_2 = await spaceModel.findOne({ where: { id: space_2.id }, include: [cityModel, appointmentModel] });
    });
    afterEach(async () => {
        lib_1.clearDbAndStorage(db);
        userData = lib_1.createUserData();
    });
    afterAll(async () => {
        await lib_1.closeTestEnv(db, server);
    });
    it("POST /images/users should upload a file into user's individual directory", async () => {
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token}`)
            .attach(storage_config_1.StorageUploadFilenames.USER_AVATAR, pathToTestImage);
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token}`)
            .attach(storage_config_1.StorageUploadFilenames.USER_AVATAR, pathToTestImage);
        const pathToUserAvatarDir = lib_1.createPathToUserAvatarDir(user.id);
        const checkIfUserAvatarDirExists = await UtilFunctions_1.default.checkIfExists(pathToUserAvatarDir);
        expect(checkIfUserAvatarDirExists).toBe(true);
        const userImagesDirFiles = await UtilFunctions_1.default.readDirectory(pathToUserAvatarDir);
        expect(userImagesDirFiles.length).toBe(2);
    });
    it("POST /images/spaces should upload a file into individual directory of user's spaces", async () => {
        expect(space_1.imagesUrl.length).toBeLessThanOrEqual(1);
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage);
        const pathToSpaceImagesDir = lib_1.createPathToSpaceImagesDir(space_1.id);
        const checkIfSpaceImagesDirExists = await UtilFunctions_1.default.checkIfExists(pathToSpaceImagesDir);
        expect(checkIfSpaceImagesDirExists).toBe(true);
        const userImagesDirFiles = await UtilFunctions_1.default.readDirectory(pathToSpaceImagesDir);
        expect(userImagesDirFiles.length).toBe(3);
    });
    it('POST /images/spaces should upload not allow to upload more than 10 files', async () => {
        expect(space_1.imagesUrl.length).toBeLessThanOrEqual(1);
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage);
        expect(res.status).toBe(enums_1.HttpStatus.FORBIDDEN);
        const space = await spaceDao.findById(space_1.id);
        const pathToSpaceImagesDir = lib_1.createPathToSpaceImagesDir(space_1.id);
        const spaceImagesDirFiles = await UtilFunctions_1.default.readDirectory(pathToSpaceImagesDir);
        expect(spaceImagesDirFiles.length).toBe(0);
    });
    it('POST /images/users should disallow not authorized users to upload images', async () => {
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users`)
            .attach('userAvatar', pathToTestImage, { filename: 'userAvatar' });
        expect(res.status).toBe(enums_1.HttpStatus.UNAUTHORIZED);
    });
    it("GET /images/users/:userId should get user's avatar by filename provided", async () => {
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token}`)
            .attach(storage_config_1.StorageUploadFilenames.USER_AVATAR, pathToTestImage);
        const freshUser = await userDao.findById(user.id);
        const res = await request(app)
            .get(`${enums_1.ApiRoutes.IMAGES}/users/${user.id}`)
            .send({ filename: freshUser.avatarUrl });
        expect(res.body instanceof Buffer).toBe(true);
    });
    it("GET /images/spaces/:spaceId should get space's image by filename provided", async () => {
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage);
        const freshSpace = await spaceDao.findById(space_1.id);
        const res = await request(app)
            .get(`${enums_1.ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .send({ filename: freshSpace.imagesUrl[1] });
        expect(res.body instanceof Buffer).toBe(true);
    });
    it("DELETE /images/users should remove image from user's individual directory", async () => {
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token}`)
            .attach(storage_config_1.StorageUploadFilenames.USER_AVATAR, pathToTestImage);
        const freshUser = await userDao.findById(user.id);
        const pathToUserAvatarIndividualDirectory = lib_1.createPathToUserAvatarDir(user.id);
        const pathToUserImage = path.join(pathToUserAvatarIndividualDirectory, freshUser.avatarUrl);
        expect(await UtilFunctions_1.default.checkIfExists(pathToUserImage)).toBeTruthy();
        await request(app)
            .delete(`${enums_1.ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token}`)
            .send({ userAvatarToRemove: freshUser.avatarUrl });
        expect(await UtilFunctions_1.default.checkIfExists(pathToUserImage)).toBeFalsy();
    });
    it("DELETE /images/spaces/:spaceId should remove image from individual directory of user's space", async () => {
        await request(app)
            .post(`${enums_1.ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, pathToTestImage);
        const freshSpace = await spaceDao.findById(space_1.id);
        const pathToSpaceImagesIndividualDirectory = lib_1.createPathToSpaceImagesDir(space_1.id);
        const pathToSpaceImage = path.join(pathToSpaceImagesIndividualDirectory, freshSpace.imagesUrl[1]);
        expect(await UtilFunctions_1.default.checkIfExists(pathToSpaceImage)).toBeTruthy();
        await request(app)
            .delete(`${enums_1.ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ spaceImagesToRemove: [freshSpace.imagesUrl[1]] });
        expect(await UtilFunctions_1.default.checkIfExists(pathToSpaceImage)).toBeFalsy();
    });
});
//# sourceMappingURL=image.spec.js.map