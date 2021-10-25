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
import { TIsoDatesReserved } from '../models/appointment.model';
import UtilFunctions from '../utils/UtilFunctions';

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
    let isoDatesToReserve: TIsoDatesReserved;
    let isoDatesToReserveNarrow: TIsoDatesReserved;
    let isoDatesToReserveWide: TIsoDatesReserved;

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
        space = await spaceModel.create(spaceData, { include: [City] });
        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [City, Appointment],
        });

        // 2020-12-20 2020-12-15
        isoDatesToReserve = UtilFunctions.createIsoDatesRangeToCreateAppointments(
            '2020-12-15',
            '14:00',
            '2020-12-20',
            '12:00',
            space.city['dataValues']['timezone']
        );
        isoDatesToReserveNarrow = UtilFunctions.createIsoDatesRangeToCreateAppointments(
            '2020-12-17',
            '14:00',
            '2020-12-19',
            '12:00',
            space.city['dataValues']['timezone']
        );
        isoDatesToReserveWide = UtilFunctions.createIsoDatesRangeToCreateAppointments(
            '2020-12-10',
            '14:00',
            '2020-12-24',
            '12:00',
            space.city['dataValues']['timezone']
        );
        token = await createTokenAndSign(user.id);
        console.log(isoDatesToReserve, 'isoooooooo');
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
                isoDatesToReserve,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(HttpStatus.CREATED);
    });

    it('POST /appointments should parse timezones properly and store appointments in +0 timezone', async () => {
        const res = await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({
                isoDatesToReserve,
                spaceId: space.id,
            })
            .set('Authorization', `Bearer ${token}`);

        expect(res.body.data.isoDatesReserved).toStrictEqual([
            { inclusive: true, value: '2020-12-15T11:00:00.000Z' },
            { inclusive: false, value: '2020-12-20T09:00:00.000Z' },
        ]);
    });

    it('POST /appointments should not allow to register if a space is unavailable (range contains)', async () => {
        // TODO refactor from using request to using model directly
        await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({ isoDatesToReserve, spaceId: space.id })
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({ isoDatesToReserve: isoDatesToReserveWide, spaceId: space.id })
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });

    it('POST /appointments should not allow to register if a space is unavailable (range is contained)', async () => {
        await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({ isoDatesToReserve, spaceId: space.id })
            .set('Authorization', `Bearer ${token}`);

        const res = await request(app)
            .post(`${ApiRoutes.APPOINTMENTS}`)
            .send({ isoDatesToReserve: isoDatesToReserveNarrow, spaceId: space.id })
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(HttpStatus.FORBIDDEN);
    });
});
