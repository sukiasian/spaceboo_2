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

describe('Appointment (e2e)', () => {
    let app: express.Express;
    let server: any;
    let applicationInstance: Application;
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
    let resIsoDatesToReserve: IResIsoDatesReserved;
    let resIsoDatesToReserveNarrow: IResIsoDatesReserved;
    let resIsoDatesToReserveWide: IResIsoDatesReserved;

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
        token = await createTokenAndSign<object>({ id: user.id });
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
});
