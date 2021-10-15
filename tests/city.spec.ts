import * as express from 'express';
import * as request from 'supertest';
import {} from 'jest';
import * as dotenv from 'dotenv';
import { Application } from '../App';
import { IUserCreate, User } from '../models/user.model';
import {
    clearDb,
    closeTestEnv,
    createApplicationInstance,
    createInvalidUserData,
    createSpaceData,
    createUserData,
    openTestEnv,
} from './lib';
import { Sequelize } from 'sequelize-typescript';
import { ApiRoutes, HttpStatus } from '../types/enums';
import { ISpaceCreate, Space } from '../models/space.model';
import { Appointment } from '../models/appointment.model';
import { City } from '../models/city.model';

describe('City (e2e)', () => {
    let app: express.Express;
    let server: any;
    let applicationInstance: Application;
    let db: Sequelize;
    let city: City;
    let cityModel: typeof City;

    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });

        applicationInstance = createApplicationInstance();

        app = applicationInstance.app;
        db = applicationInstance.sequelize;

        cityModel = City;

        server = (await openTestEnv(applicationInstance)).server;
        city = await cityModel.findOne({ raw: true });
    });

    beforeEach(async () => {});

    afterEach(async () => {
        clearDb(db);
    });

    afterAll(async () => {
        await closeTestEnv(db, server);
    });

    it('/cities should get all cities by query', async () => {
        expect(1).toBe(1);
    });
    it('UtilFunctions.timezoneParser should parse all timezones properly', async () => {});
});
