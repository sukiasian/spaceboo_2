import * as express from 'express';
import * as request from 'supertest';
import * as path from 'path';
import * as faker from 'faker';
import { Application } from '../App';
import { IUserCreate, User, UserRoles, UserScopes } from '../models/user.model';
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
import { ApiRoutes, HttpStatus } from '../types/enums';
import { ISpaceCreate, Space } from '../models/space.model';
import { Appointment } from '../models/appointment.model';
import { City } from '../models/city.model';
import { StorageUploadFilenames } from '../configurations/storage.config';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import { fake } from 'faker';

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
    let token_1: unknown;
    let token_2: unknown;
    let userModel: typeof User;
    let spaceData_1: ISpaceCreate;
    let spaceModel: typeof Space;
    let space_1: Space;
    let city: City;
    let cityModel: typeof City;
    let appointmentModel: typeof Appointment;
    let pathToTestImage: string;
    let fakePassword: string;
    let fakeName: string;

    beforeAll(async () => {
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

        fakePassword = 'fakepassword';
        fakeName = 'Петр';

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
        token_1 = await createTokenAndSign<object>({ id: user_1.id });
        token_2 = await createTokenAndSign<object>({ id: user_2.id });
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

    it('PUT /users should update user data', async () => {
        const res = await request(app)
            .put(`${ApiRoutes.USERS}`)
            .set('Authorization', `Bearer ${token_1}`)
            .send({
                userEditData: {
                    name: fakeName,
                },
            });

        expect(res.status).toBe(HttpStatus.OK);

        const freshUser = await userDao.findById(user_1.id);
        expect(freshUser.name);
    });

    it("PUT /users should not be able to update user's role", async () => {
        const res = await request(app)
            .put(`${ApiRoutes.USERS}`)
            .set('Authorization', `Bearer ${token_1}`)
            .send({
                userEditData: {
                    role: UserRoles.ADMIN,
                },
            });

        const freshUser: User = await userModel.scope(UserScopes.WITH_PASSWORD).findOne({ where: { id: user_1.id } });

        expect(freshUser.role).toBe(UserRoles.USER);
    });

    it('PUT /auth/passwordChange passwords should match', async () => {
        // FIXME works from time to times
        const res_1 = await request(app)
            .put(`${ApiRoutes.AUTH}/passwordChange`)
            .set('Authorization', `Bearer ${token_1}`)
            .send({
                userEditData: {
                    password: fakePassword,
                    passwordConfirmation: fakePassword.toUpperCase(),
                },
            });

        expect(res_1.status).toBe(HttpStatus.INTERNAL_SERVER_ERROR);

        const res_2 = await request(app)
            .put(`${ApiRoutes.USERS}/passwordChange`)
            .set('Authorization', `Bearer ${token_1}`)
            .send({
                userEditData: {
                    password: fakePassword,
                    passwordConfirmation: fakePassword,
                },
            });

        expect(res_2.status).toBe(HttpStatus.OK);
    });
});
