import * as express from 'express';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { Application } from '../App';
import { IUserCreate, User } from '../models/user.model';
import {
    clearDb,
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
import { IResIsoDatesReserved } from '../../frontend/src/types/resTypes';

describe('Route Protector (e2e)', () => {
    let app: express.Express;
    let server: any;
    let applicationInstance: Application;
    let db: Sequelize;
    let user_1: User;
    let user_2: User;
    let userData_1: IUserCreate;
    let userData_2: IUserCreate;
    let token_1: unknown;
    let token_2: unknown;
    let userModel: typeof User;
    let spaceData_1: ISpaceCreate;
    let spaceData_2: ISpaceCreate;
    let spaceModel: typeof Space;
    let city: City;
    let cityModel: typeof City;
    let space_1: Space;
    let appointmentModel: typeof Appointment;

    beforeAll(async () => {
        applicationInstance = createApplicationInstance();

        app = applicationInstance.app;
        db = applicationInstance.sequelize;

        userModel = User;
        spaceModel = Space;
        cityModel = City;
        appointmentModel = Appointment;

        userData_1 = createUserData();
        userData_2 = createUserData();

        server = (await openTestEnv(applicationInstance)).server;
    });

    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        user_1 = await userModel.create(userData_1);
        user_2 = await userModel.create(userData_2);
        spaceData_1 = createSpaceData(user_1.id, city.id);
        spaceData_2 = createSpaceData(user_2.id, city.id);
        space_1 = await spaceModel.create(spaceData_1, { include: [City] });
        space_1 = await spaceModel.findOne({
            where: { id: space_1.id },
            include: [City, Appointment],
        });
        token_1 = await createTokenAndSign<object>({ id: user_1.id });
        token_2 = await createTokenAndSign<object>({ id: user_2.id });
    });

    afterEach(async () => {
        clearDb(db);
    });

    afterAll(async () => {
        await closeTestEnv(db, server);
    });

    it('DELETE /images/users/:spaceId should disallow non-space owners to delete space images', async () => {
        // создать другого юзера user_2 и обратиться к space_1
        const res = await request(app)
            .delete(`${ApiRoutes.IMAGES}/spaces/${space_1.id}`)
            .set('Authorization', `Bearer ${token_2}`);

        expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('POST /spaces should extract token from cookies', async () => {
        const res = await request(app)
            .post(`${ApiRoutes.SPACES}/`)
            .send(spaceData_2)
            .set('Cookie', [`jwt=${token_2}`]);

        expect(res.status).toBe(HttpStatus.CREATED);
    });
});
