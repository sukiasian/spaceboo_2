import * as express from 'express';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Application } from '../App';
import { IUserCreate, User } from '../models/user.model';
import {
    clearDbAndStorage,
    closeTestEnv,
    createApplicationInstance,
    createSpaceData,
    createTokenAndSign,
    createUserData,
    openTestEnv,
} from './lib';
import { Sequelize } from 'sequelize-typescript';
import { ApiRoutes } from '../types/enums';
import { ISpaceCreate, Space } from '../models/space.model';
import { Appointment } from '../models/appointment.model';
import { City } from '../models/city.model';
import { StorageUploadFilenames } from '../configurations/storage.config';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';

describe('User (e2e)', () => {
    let app: express.Express;
    let server: any;
    let applicationInstance: Application;
    let db: Sequelize;
    let user_1: User;
    let user_2: User;
    let userData_1: IUserCreate;
    let userData_2: IUserCreate;
    let userDao: UserSequelizeDao;
    let token_1: string;
    let token_2: string;
    let userModel: typeof User;
    let spaceData_1: ISpaceCreate;
    let spaceModel: typeof Space;
    let space_1: Space;
    let city: City;
    let cityModel: typeof City;
    let appointmentModel: typeof Appointment;
    let pathToTestImage: string;

    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });

        applicationInstance = createApplicationInstance();

        app = applicationInstance.app;
        db = applicationInstance.sequelize;

        pathToTestImage = path.resolve('tests', 'files', 'images', '1.png');

        userModel = User;
        spaceModel = Space;
        cityModel = City;
        appointmentModel = Appointment;

        userDao = userSequelizeDao;

        userData_1 = createUserData();
        userData_2 = createUserData();

        server = (await openTestEnv(applicationInstance)).server;
    });

    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        user_1 = await userModel.create(userData_1);
        user_2 = await userModel.create(userData_2);
        spaceData_1 = createSpaceData(user_1.id, city.id);
        space_1 = await spaceModel.create(spaceData_1, { include: [City] });
        space_1 = await spaceModel.findOne({
            where: { id: space_1.id },
            include: [City, Appointment],
        });
        token_1 = await createTokenAndSign(user_1.id);
        token_2 = await createTokenAndSign(user_2.id);
    });

    afterEach(async () => {
        clearDbAndStorage(db);
    });

    afterAll(async () => {
        await closeTestEnv(db, server);
    });

    it('POST /images/users should add avatarUrl to DB', async () => {
        expect(user_1.avatarUrl).toBeNull();

        await request(app)
            .post(`${ApiRoutes.IMAGES}/users/`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(StorageUploadFilenames.USER_AVATAR, pathToTestImage);

        const freshUser: User = await userDao.findById(user_1.id);
        expect(freshUser.avatarUrl).toBeDefined();
    });

    it('DELETE /images/users/ should remove avatarUrl from DB', async () => {
        expect(user_1.avatarUrl).toBeNull();

        await request(app)
            .post(`${ApiRoutes.IMAGES}/users/`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(StorageUploadFilenames.USER_AVATAR, pathToTestImage);

        const user: User = await userDao.findById(user_1.id);
        expect(user.avatarUrl).toBeDefined();

        await request(app)
            .delete(`${ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token_1}`)
            .send({ userAvatarToRemove: user.avatarUrl });

        const freshUser: User = await userDao.findById(user_1.id);

        expect(freshUser.avatarUrl).toBeNull();
    });
});
