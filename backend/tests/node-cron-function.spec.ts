import * as dotenv from 'dotenv';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { AppConfig } from '../AppConfig';
import {
    clearDb,
    clearDbAndStorage,
    closeTestEnv,
    createAppConfig,
    createAppoinmentData,
    createNodeCronFunctions,
    createSpaceData,
    createUserData,
    openTestEnv,
} from './lib';
import { Sequelize } from 'sequelize-typescript';
import { NodeCronFunctions } from '../utils/NodeCronFunctions';
import { IUserCreate, User } from '../models/user.model';
import { Space } from '../models/space.model';
import { Appointment, TIsoDatesReserved } from '../models/appointment.model';
import { City } from '../models/city.model';
import { ApiRoutes } from '../types/enums';
import { StorageUploadFilenames } from '../configurations/storage.config';

describe('NodeCronjob (e2e)', () => {
    let app: express.Express;
    let server: any;
    let appConfig: AppConfig;
    let sequelize: Sequelize;
    let nodeCronFunctions: NodeCronFunctions;
    let userModel: typeof User;
    let user_1: User;
    let user_2: User;
    let userData_1: IUserCreate;
    let userData_2: IUserCreate;
    let token_1: string;
    let token_2: string;
    let spaceModel: typeof Space;
    let appointmentModel: typeof Appointment;
    let cityModel: typeof City;
    let city: City;
    let pathToTestImage_1: string;
    let pathToTestImage_2: string;
    let isoDatesReserved_1: TIsoDatesReserved;
    let isoDatesReserved_2: TIsoDatesReserved;

    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });

        appConfig = createAppConfig();
        nodeCronFunctions = createNodeCronFunctions();

        userModel = User;
        spaceModel = Space;
        appointmentModel = Appointment;
        cityModel = City;

        userData_1 = createUserData();
        userData_2 = createUserData();
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

        server = (await openTestEnv(appConfig)).server;
    });

    beforeEach(async () => {
        city = await cityModel.findOne();
        user_1 = await userModel.create(userData_1);
        user_2 = await userModel.create(userData_2);
        token_1 = jwt.sign({ id: user_1.id }, process.env.JWT_SECRET_KEY);
        token_2 = jwt.sign({ id: user_2.id }, process.env.JWT_SECRET_KEY);
    });

    afterEach(async () => {
        clearDb(sequelize);
    });

    afterAll(async () => {
        await clearDbAndStorage(sequelize);
        await closeTestEnv(sequelize, server);
    });

    it('Function "archiveOutdatedAppointments" should set all appointments\' "archived" property to true', async () => {
        const spaceData_1 = createSpaceData(user_1.id, city.id);
        const space_1 = await spaceModel.create(spaceData_1);
        const appointmentData_1 = createAppoinmentData(isoDatesReserved_1, space_1.id, user_1.id);
        const appointmentForSpace_1 = await appointmentModel.create(appointmentData_1);
        const spaceData_2 = createSpaceData(user_2.id, city.id);
        const space_2 = await spaceModel.create(spaceData_2);
        const appointmentData_2 = createAppoinmentData(isoDatesReserved_2, space_2.id, user_2.id);
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
        let responseForUploadingImageForUser_1: any;
        let responseForUploadingImageForUser_2: any;

        responseForUploadingImageForUser_1 = await request(app)
            .post(`${ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(StorageUploadFilenames.USER_AVATAR, pathToTestImage_1);

        const outdatedAvatarUrlForUser_1 = (
            await userModel.findOne({
                where: {
                    id: user_1.id,
                },
            })
        ).avatarUrl;

        expect(fs.existsSync(path.resolve('assets/images', outdatedAvatarUrlForUser_1))).toBeTruthy();

        responseForUploadingImageForUser_1 = await request(app)
            .post(`${ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(StorageUploadFilenames.USER_AVATAR, pathToTestImage_2);

        responseForUploadingImageForUser_2 = await request(app)
            .post(`${ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token_2}`)
            .attach(StorageUploadFilenames.USER_AVATAR, pathToTestImage_1);

        const outdatedAvatarUrlForUser_2 = (
            await userModel.findOne({
                where: {
                    id: user_2.id,
                },
            })
        ).avatarUrl;

        expect(fs.existsSync(path.resolve('assets/images', outdatedAvatarUrlForUser_2))).toBeTruthy();

        responseForUploadingImageForUser_2 = await request(app)
            .post(`${ApiRoutes.IMAGES}/users`)
            .set('Authorization', `Bearer ${token_2}`)
            .attach(StorageUploadFilenames.USER_AVATAR, pathToTestImage_2);

        nodeCronFunctions.removeOutdatedUserAvatarsFromStorage();

        const checkIfOutdatedAvatarExistsForUser_1 = fs.existsSync(outdatedAvatarUrlForUser_1);
        const checkIfOutdatedAvatarExistsForUser_2 = fs.existsSync(outdatedAvatarUrlForUser_2);

        expect(checkIfOutdatedAvatarExistsForUser_1).toBeFalsy();
        expect(checkIfOutdatedAvatarExistsForUser_2).toBeFalsy();
    });

    it('Function "removeOutdatedSpaceImagesFromStorage" should remove outdated space images according to avatarUrl', async () => {
        const spaceData_1 = createSpaceData(user_1.id, city.id, 1000);
        const spaceData_2 = createSpaceData(user_2.id, city.id, 1000);
        const configureRequestForSpace = (request: request.SuperTest<request.Test>): request.Test => {
            let req = request.post(ApiRoutes.SPACES);

            for (const field in spaceData_1) {
                req = req.field(field, spaceData_1[field]);
            }

            req.set('Authorization', `Bearer ${token_1}`).attach(
                StorageUploadFilenames.SPACE_IMAGES,
                pathToTestImage_2
            );

            return req;
        };

        const space_1 = await configureRequestForSpace(request(app));
        const responseForEditingSpace_1 = await request(app)
            .put(`ApiRoutes.SPACES/${space_1}`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(StorageUploadFilenames.SPACE_IMAGES, pathToTestImage_2);
        const freshSpace_1 = await spaceModel.findOne({
            where: {
                id: space_1.body.data.id,
            },
        });
    });

    it('Function "removeOutdatedEmailsFromDb" should remove outdated space images according to avatarUrl', async () => {
        const spaceData_1 = createSpaceData(user_1.id, city.id, 1000);
        const spaceData_2 = createSpaceData(user_2.id, city.id, 1000);

        const space_1 = await request(app)
            .post(ApiRoutes.SPACES)
            .send(spaceData_1)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(StorageUploadFilenames.SPACE_IMAGES, pathToTestImage_1);

        const space_2 = await request(app)
            .post(ApiRoutes.SPACES)
            .send(spaceData_2)
            .set('Authorization', `Bearer ${token_2}`)
            .attach(StorageUploadFilenames.SPACE_IMAGES, pathToTestImage_1);

        const responseForEditingSpace_1 = await request(app)
            .put(`ApiRoutes.SPACES/${space_1}`)
            .set('Authorization', `Bearer ${token_1}`)
            .attach(StorageUploadFilenames.SPACE_IMAGES, pathToTestImage_2);
    });
});
