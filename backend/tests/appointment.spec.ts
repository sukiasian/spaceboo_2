import * as express from 'express';
import * as request from 'supertest';
import * as dotenv from 'dotenv';
import { AppConfig } from '../AppConfig';
import { IUserCreate, User } from '../models/user.model';
import {
    clearDb,
    closeTestEnv,
    createAppConfig,
    createAppoinmentData,
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

describe('Appointment (e2e)', () => {
    let app: express.Express;
    let server: any;
    let appConfig: AppConfig;
    let db: Sequelize;
    let userData: IUserCreate;
    let user: User;
    let token: unknown;
    let userModel: typeof User;
    let spaceData: ISpaceCreate;
    let spaceModel: typeof Space;
    let city: City;
    let cityModel: typeof City;
    let space: Space;
    let appointmentModel: typeof Appointment;
    let resIsoDatesToReserve: any;
    let resIsoDatesToReserveNarrow: any;
    let resIsoDatesToReserveWide: any;

    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });

        appConfig = createAppConfig();

        app = appConfig.app;
        db = appConfig.sequelize;

        userModel = User;
        spaceModel = Space;
        cityModel = City;
        appointmentModel = Appointment;

        userData = createUserData();
        resIsoDatesToReserve = {
            beginningDate: '2020-12-15',
            beginningTime: '14:00',
            endingDate: '2020-12-20',
            endingTime: '12:00',
        };
        resIsoDatesToReserveNarrow = {
            beginningDate: '2020-12-17',
            beginningTime: '14:00',
            endingDate: '2020-12-19',
            endingTime: '12:00',
        };
        resIsoDatesToReserveWide = {
            beginningDate: '2020-12-12',
            beginningTime: '14:00',
            endingDate: '2020-12-25',
            endingTime: '12:00',
        };
        server = (await openTestEnv(appConfig)).server;
    });

    beforeEach(async () => {
        city = await cityModel.findOne({ raw: true });
        user = await userModel.create(userData);
        spaceData = createSpaceData(user.id, city.id);
        space = await spaceModel.create(spaceData, { include: [City] });
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [City, Appointment],
        });
        token = createTokenAndSign<object>({ id: user.id });
        /* 
            TODO: здесь мы создаем напрямую. если у нас стоят валидаторы у модели то здесь мы не должны суметь создавать записи на время 
            которое меньше чем дата сейчас.

            Мы можем сделать это напрямую в endpoint-e и возможно так будет даже лучше. 
        */
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
                resIsoDatesToReserve,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(HttpStatus.CREATED);
    });

    it('POST /appointments should not create an appointment if the space is unavailable', async () => {
        const appointments = await appointmentModel.count({ where: { spaceId: space.id } });
        expect(appointments).toBe(0);
        await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({
                resIsoDatesToReserve,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);

        const res_1 = await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({
                resIsoDatesToReserve,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);

        expect(res_1.status).toBe(HttpStatus.FORBIDDEN);

        const res_2 = await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({
                resIsoDatesToReserve: resIsoDatesToReserveNarrow,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);

        expect(res_2.status).toBe(HttpStatus.FORBIDDEN);

        const res_3 = await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({
                resIsoDatesToReserve: resIsoDatesToReserveWide,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);

        expect(res_3.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('POST /appointments should parse timezones properly and store appointments in +0 timezone', async () => {
        const res = await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({
                resIsoDatesToReserve,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);

        expect(res.body.data.isoDatesReserved).toStrictEqual([
            { inclusive: true, value: '2020-12-15T14:00:00.000Z' },
            { inclusive: false, value: '2020-12-20T12:00:00.000Z' },
        ]);
    });

    it('POST /appointments should check if date is not in the past', async () => {});

    it('GET /appointments should get appointments by required dates', async () => {
        await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({
                resIsoDatesToReserve,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .get(`${ApiRoutes.APPOINTMENTS}`)
            .send({
                requiredDates: "'[2020-12-01, 2020-12-31]'",
            })
            .set('Authorization', `Bearer ${token}`);
    });
});
