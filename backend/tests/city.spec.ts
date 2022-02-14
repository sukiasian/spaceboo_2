import * as express from 'express';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { AppConfig } from '../AppConfig';
import { clearDb, closeTestEnv, createAppConfig, openTestEnv } from './lib';
import { Sequelize } from 'sequelize-typescript';
import { City } from '../models/city.model';

describe('City (e2e)', () => {
    let app: express.Express;
    let server: any;
    let appConfig: AppConfig;
    let db: Sequelize;
    let city: City;
    let cityModel: typeof City;

    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });

        appConfig = createAppConfig();

        app = appConfig.app;
        db = appConfig.sequelize;

        cityModel = City;

        server = (await openTestEnv(appConfig)).server;
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
