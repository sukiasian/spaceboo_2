import * as express from 'express';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { Application } from '../App';
import { IUserCreate, User } from '../models/user.model';
import {
    clearDb,
    closeTestEnv,
    createApplicationInstance,
    createCustomDate,
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
import { TDatesReserved } from '../models/appointment.model';

describe('Appointment (e2e)', () => {
    let app: express.Express;
    let server: any;
    let applicationInstance: Application;
    let db: Sequelize;
    let userData: IUserCreate;
    let user: User;
    let token: string;
    let userModel: typeof User;
    let spaceData: ISpaceCreate;
    let spaceModel: typeof Space;
    let city: City;
    let cityModel: typeof City;
    let space: Space;
    let appointmentModel: typeof Appointment;
    let beginningDate: string;
    let endingDate: string;
    let datesToReserve: TDatesReserved;

    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });

        applicationInstance = createApplicationInstance();

        app = applicationInstance.app;
        db = applicationInstance.sequelize;

        userModel = User;
        spaceModel = Space;
        cityModel = City;
        appointmentModel = Appointment;

        userData = createUserData();
        server = (await openTestEnv(applicationInstance)).server;
    });

    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        user = await userModel.create(userData);
        spaceData = createSpaceData(user.id, city.id);
        space = await spaceModel.create(spaceData, { include: [{ model: City, as: 'city' }] });
        space = await spaceModel.findOne({
            where: { id: space.id },
            raw: true,
            include: [{ model: City, as: 'city' }],
        });

        beginningDate = createCustomDate('2020-12-15', space['city.timezone']);
        endingDate = createCustomDate('2020-12-20', space['city.timezone']);
        datesToReserve = [
            { inclusive: true, value: beginningDate },
            { inclusive: false, value: endingDate },
        ];
        token = await createTokenAndSign(user.id);
    });

    afterEach(async () => {
        clearDb(db);
    });

    afterAll(async () => {
        await closeTestEnv(db, server);
    });

    it('POST /appointments should create an appointment', async () => {
        const res = await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({
                datesToReserve,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(HttpStatus.CREATED);
    });

    it('POST /appointments should parse timezones properly and store appointments in +0 timezone', async () => {
        const res = await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({
                datesToReserve,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.body.data.datesReserved).toStrictEqual([
            { inclusive: true, value: '2020-12-15T00:00:00.000Z' },
            { inclusive: false, value: '2020-12-20T00:00:00.000Z' },
        ]);
    });

    it('POST /appointments should not allow to register if a space is unavailable', async () => {
        await request(app).post(`${ApiRoutes.APPOINTMENTS}`).send({ datesToReserve, spaceId: space.id });
        await request(app).post(`${ApiRoutes.APPOINTMENTS}`).send({ datesToReserve, spaceId: space.id });
        // validator
    });
});
