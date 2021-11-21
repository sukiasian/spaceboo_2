import * as express from 'express';
import * as request from 'supertest';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Application } from '../App';
import { IUserCreate, User } from '../models/user.model';
import {
    clearDbAndStorage,
    closeTestEnv,
    createApplicationInstance,
    createPathToSpaceImagesDir,
    createPathToUserAvatarDir,
    createSpaceData,
    createTokenAndSign,
    createUserData,
    openTestEnv,
} from './lib';
import { Sequelize } from 'sequelize-typescript';
import { ApiRoutes, HttpStatus } from '../types/enums';
import { ISpaceCreate, Space } from '../models/space.model';
import { Appointment } from '../models/appointment.model';
import { City } from '../models/city.model';
import UtilFunctions from '../utils/UtilFunctions';
import { StorageUploadFilenames } from '../configurations/storage.config';
import { SpaceSequelizeDao, spaceSequelizeDao } from '../daos/space.sequelize.dao';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';

describe('Image (e2e)', () => {
    let app: express.Express;
    let server: any;
    let applicationInstance: Application;
    let db: Sequelize;
    let user: User;
    let userData: IUserCreate;
    let userModel: typeof User;
    let userDao: UserSequelizeDao;
    let spaceData: ISpaceCreate;
    let spaceData_2: ISpaceCreate;
    let spaceDao: SpaceSequelizeDao;
    let spaceModel: typeof Space;
    let city: City;
    let city_2: City;
    let cityModel: typeof City;
    let appointmentModel: typeof Appointment;
    let token: string;
    let space_1: Space;
    let space_2: Space;
    let pathToTestImage: string;

    beforeAll(async () => {
        dotenv.config({ path: '../test.config.env' });

        applicationInstance = createApplicationInstance();

        app = applicationInstance.app;
        db = applicationInstance.sequelize;

        pathToTestImage = path.resolve('tests', 'files', 'images', '1.png');

        spaceDao = spaceSequelizeDao;
        userDao = userSequelizeDao;

        userModel = User;
        spaceModel = Space;
        cityModel = City;
        appointmentModel = Appointment;
        userData = createUserData();
        server = (await openTestEnv(applicationInstance)).server;
    });
    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        city_2 = await cityModel.findOne({ where: { city: 'Краснодар' } });
        user = await userModel.create(userData);
        spaceData = createSpaceData(user.id, city.id, 1500);
        spaceData_2 = createSpaceData(user.id, city_2.id);
        token = await createTokenAndSign(user.id);
        space_1 = await spaceModel.create(spaceData);
        space_1 = await spaceModel.findOne({
            where: { id: space_1.id },
            include: [cityModel, appointmentModel],
        });
        space_2 = await spaceModel.create(spaceData_2);
        space_2 = await spaceModel.findOne({ where: { id: space_2.id }, include: [cityModel, appointmentModel] });
    });

    afterEach(async () => {
        clearDbAndStorage(db);

        userData = createUserData();
    });

    afterAll(async () => {
        await closeTestEnv(db, server);
    });

    it("POST /images/users should upload a file into user's individual directory", async () => {
        await request(app)
            .post(`${ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token}`)
            .attach(StorageUploadFilenames.USER_AVATAR, pathToTestImage);
        await request(app)
            .post(`${ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token}`)
            .attach(StorageUploadFilenames.USER_AVATAR, pathToTestImage);

        const pathToUserAvatarDir = createPathToUserAvatarDir(user.id);
        const checkIfUserAvatarDirExists = await UtilFunctions.checkIfExists(pathToUserAvatarDir);

        expect(checkIfUserAvatarDirExists).toBe(true);

        const userImagesDirFiles = await UtilFunctions.readDirectory(pathToUserAvatarDir);

        expect(userImagesDirFiles.length).toBe(2);
    });

    it("POST /images/spaces should upload a file into individual directory of user's spaces", async () => {
        expect(space_1.imagesUrl.length).toBeLessThanOrEqual(1);

        await request(app)
            .post(`${ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage);

        const pathToSpaceImagesDir = createPathToSpaceImagesDir(space_1.id);
        const checkIfSpaceImagesDirExists = await UtilFunctions.checkIfExists(pathToSpaceImagesDir);

        expect(checkIfSpaceImagesDirExists).toBe(true);

        const userImagesDirFiles = await UtilFunctions.readDirectory(pathToSpaceImagesDir);

        expect(userImagesDirFiles.length).toBe(3);
    });

    it('POST /images/spaces should upload not allow to upload more than 10 files', async () => {
        expect(space_1.imagesUrl.length).toBeLessThanOrEqual(1);

        const res = await request(app)
            .post(`${ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage);

        expect(res.status).toBe(HttpStatus.FORBIDDEN);

        const space: Space = await spaceDao.findById(space_1.id);
        const pathToSpaceImagesDir = createPathToSpaceImagesDir(space_1.id);
        const spaceImagesDirFiles = await UtilFunctions.readDirectory(pathToSpaceImagesDir);

        expect(spaceImagesDirFiles.length).toBe(0);
    });

    it('POST /images/users should disallow not authorized users to upload images', async () => {
        const res = await request(app)
            .post(`${ApiRoutes.IMAGES}/users`)
            .attach('userAvatar', pathToTestImage, { filename: 'userAvatar' });

        expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it("GET /images/users/:userId should get user's avatar by filename provided", async () => {
        await request(app)
            .post(`${ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token}`)
            .attach(StorageUploadFilenames.USER_AVATAR, pathToTestImage);

        const freshUser: User = await userDao.findById(user.id);
        const res = await request(app)
            .get(`${ApiRoutes.IMAGES}/users/${user.id}`)
            .send({ filename: freshUser.avatarUrl });

        expect(res.body instanceof Buffer).toBe(true);
    });

    it("GET /images/spaces/:spaceId should get space's image by filename provided", async () => {
        await request(app)
            .post(`${ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage);

        const freshSpace: Space = await spaceDao.findById(space_1.id);
        const res = await request(app)
            .get(`${ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .send({ filename: freshSpace.imagesUrl[1] });

        expect(res.body instanceof Buffer).toBe(true);
    });

    it("DELETE /images/users should remove image from user's individual directory", async () => {
        await request(app)
            .post(`${ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token}`)
            .attach(StorageUploadFilenames.USER_AVATAR, pathToTestImage);

        const freshUser: User = await userDao.findById(user.id);
        const pathToUserAvatarIndividualDirectory = createPathToUserAvatarDir(user.id);
        const pathToUserImage = path.join(pathToUserAvatarIndividualDirectory, freshUser.avatarUrl);

        expect(await UtilFunctions.checkIfExists(pathToUserImage)).toBeTruthy();

        await request(app)
            .delete(`${ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token}`)
            .send({ userAvatarToRemove: freshUser.avatarUrl });

        expect(await UtilFunctions.checkIfExists(pathToUserImage)).toBeFalsy();
    });

    it("DELETE /images/spaces/:spaceId should remove image from individual directory of user's space", async () => {
        await request(app)
            .post(`${ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach(StorageUploadFilenames.SPACE_IMAGE, pathToTestImage);

        const freshSpace: Space = await spaceDao.findById(space_1.id);
        const pathToSpaceImagesIndividualDirectory = createPathToSpaceImagesDir(space_1.id);
        const pathToSpaceImage = path.join(pathToSpaceImagesIndividualDirectory, freshSpace.imagesUrl[1]);
        console.log(await UtilFunctions.checkIfExists(pathToSpaceImage));

        expect(await UtilFunctions.checkIfExists(pathToSpaceImage)).toBeTruthy();

        await request(app)
            .delete(`${ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ spaceImagesToRemove: [freshSpace.imagesUrl[1]] });

        expect(await UtilFunctions.checkIfExists(pathToSpaceImage)).toBeFalsy();
    });
});
