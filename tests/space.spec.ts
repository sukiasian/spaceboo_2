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
import { ApiRoutes, HttpStatus, SequelizeModelProps } from '../types/enums';
import { ISpaceCreate, Space } from '../models/space.model';
import { Appointment } from '../models/appointment.model';
import { City } from '../models/city.model';
import { TIsoDatesReserved } from '../models/appointment.model';
import UtilFunctions from '../utils/UtilFunctions';

describe('Space (e2e)', () => {
    let app: express.Express;
    let server: any;
    let applicationInstance: Application;
    let db: Sequelize;
    let userData: IUserCreate;
    let user: User;
    let userModel: typeof User;
    let spaceData: ISpaceCreate;
    let spaceModel: typeof Space;
    let city: City;
    let cityModel: typeof City;
    let appointmentModel: typeof Appointment;
    let token: string;

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
        token = await createTokenAndSign(user.id);
    });

    afterEach(async () => {
        clearDb(db);
        userData = createUserData();
    });

    afterAll(async () => {
        await closeTestEnv(db, server);
    });

    it('POST /spaces should create a space', async () => {
        const spaces = await spaceModel.findAll({ raw: true });

        expect(spaces.length).toBe(0);

        const res = await request(app)
            .post(`${ApiRoutes.SPACES}`)
            .send(spaceData)
            .set('Authorization', `Bearer ${token}`);

        expect(res.status).toBe(HttpStatus.CREATED);

        const spacesFresh = await spaceModel.findAll({ raw: true });

        expect(spacesFresh.length).toBeGreaterThan(0);
        expect(spacesFresh[0].userId).toBe(spaceData.userId);
    });

    it('GET /spaces should get all spaces by query', async () => {
        // FIXME tests below are copy-pasted
        let space = await spaceModel.create(spaceData);

        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [City, Appointment],
        });

        const datesToReserve_1 = UtilFunctions.createIsoDatesRangeToCreateAppointments(
            '2020-12-15',
            '14:00',
            '2020-12-20',
            '12:00',
            space.city['dataValues']['timezone']
        );
        const datesToReserve_2 = UtilFunctions.createIsoDatesRangeToCreateAppointments(
            '2021-12-15',
            '14:00',
            '2021-12-20',
            '12:00',
            space.city['dataValues']['timezone']
        );

        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: datesToReserve_2,
        });

        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });
        console.log(spaceFresh['appointments']);

        const res = await request(app)
            .get(`${ApiRoutes.SPACES}`)
            .query({ datesToReserve: '2020-12-15,2020-12-20', timesToReserve: '14:00,12:00' });

        console.log(res.body.data[0], 'dataaaaaa');
        console.log(res.body.data[0].appointments[0].isoDatesReserved, 'bodyyyyyyyy');

        const appointment = await appointmentModel.findOne();
    });

    it('PUT /spaces should edit space by id', async () => {});

    it('DELETE /spaces should delete space from database', async () => {});

    it('Created appointments should relate to space', async () => {
        let space = await spaceModel.create(spaceData);

        space = await spaceModel.findOne({
            where: { id: space.id },
            include: [City, Appointment],
        });

        const isoDatesToReserve_1 = UtilFunctions.createIsoDatesRangeToCreateAppointments(
            '2020-12-15',
            '14:00',
            '2020-12-20',
            '12:00',
            space.city['dataValues']['timezone']
        );
        const isoDatesToReserve_2 = UtilFunctions.createIsoDatesRangeToCreateAppointments(
            '2021-12-15',
            '14:00',
            '2021-12-20',
            '12:00',
            space.city['dataValues']['timezone']
        );

        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            isoDatesReserved: isoDatesToReserve_2,
        });

        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });

        expect(spaceFresh[SequelizeModelProps.DATA_VALUES].appointments).toBeTruthy();
        expect(spaceFresh[SequelizeModelProps.DATA_VALUES].appointments.length).toBe(2);
        // NOTE перед записью аппоинтмента нужно проверить чтобы время было свободно
    });
});
