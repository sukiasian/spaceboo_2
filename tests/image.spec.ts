import * as express from 'express';
import * as request from 'supertest';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Application } from '../App';
import { IUserCreate, User } from '../models/user.model';
import {
    clearDb,
    clearDbAndStorage,
    closeTestEnv,
    createApplicationInstance,
    createSpaceData,
    createTokenAndSign,
    createUserData,
    openTestEnv,
} from './lib';
import { Sequelize } from 'sequelize-typescript';
import { ApiRoutes, HttpStatus, SequelizeModelProps } from '../types/enums';
import { ISpaceCreate, Space } from '../models/space.model';
import { Appointment, TIsoDatesReserved } from '../models/appointment.model';
import { City } from '../models/city.model';
import UtilFunctions from '../utils/UtilFunctions';
import { SpaceQuerySortFields } from '../daos/space.sequelize.dao';

describe('Image (e2e)', () => {
    let app: express.Express;
    let server: any;
    let applicationInstance: Application;
    let db: Sequelize;
    let userData: IUserCreate;
    let user: User;
    let userModel: typeof User;
    let spaceData: ISpaceCreate;
    let spaceData_2: ISpaceCreate;
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
        await clearDbAndStorage(db);

        userData = createUserData();
    });

    afterAll(async () => {
        await closeTestEnv(db, server);
    });

    it("POST /images/user/userImages should upload a file into user's individual directory", async () => {
        await request(app)
            .post(`${ApiRoutes.IMAGES}/user/userAvatar`)
            .set('Authorization', `Bearer ${token}`)
            .attach('userAvatar', pathToTestImage, { filename: 'userAvatar' });
        await request(app)
            .post(`${ApiRoutes.IMAGES}/user/userAvatar`)
            .set('Authorization', `Bearer ${token}`)
            .attach('userAvatar', pathToTestImage, { filename: 'userAvatar' });

        const pathToUserImagesDir = path.resolve('assets', 'images', 'users', user.id);

        expect(await UtilFunctions.checkIfExists(pathToUserImagesDir)).toBe(true);

        const userImagesDirFiles = await UtilFunctions.readDirectory(pathToUserImagesDir);

        expect(userImagesDirFiles.length).toBe(2);
    });

    it('POST /images/user/userImages should disallow not authorized users to upload images', async () => {
        const res = await request(app)
            .post(`${ApiRoutes.IMAGES}/user/userAvatar`)
            .attach('userAvatar', pathToTestImage, { filename: 'userAvatar' });

        expect(res.status).toBe(HttpStatus.UNAUTHORIZED);
    });
});
