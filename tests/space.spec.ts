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
import { TDatesReserved } from '../models/appointment.model';

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

        const res = await request(app).post(`${ApiRoutes.SPACES}`).send(spaceData);

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
            raw: true,
            include: [
                { model: City, as: 'city' },
                { model: Appointment, as: 'appointments' },
            ],
        });

        const beginningDate_1 = createCustomDate('2020-12-15', space['city.timezone']);
        const endingDate_1 = createCustomDate('2020-12-20', space['city.timezone']);
        const beginningDate_2 = createCustomDate('2021-12-15', space['city.timezone']);
        const endingDate_2 = createCustomDate('2021-12-20', space['city.timezone']);

        const datesReserved_1: TDatesReserved = [
            { inclusive: true, value: beginningDate_1 },
            { inclusive: false, value: endingDate_1 },
        ];
        const datesReserved_2: TDatesReserved = [
            { inclusive: true, value: beginningDate_2 },
            { inclusive: false, value: endingDate_2 },
        ];

        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            datesReserved: datesReserved_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            datesReserved: datesReserved_2,
        });

        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });

        expect(spaceFresh['dataValues'].appointments).toBeTruthy();
        expect(spaceFresh['dataValues'].appointments.length).toBe(2);

        const res = await request(app).get(`${ApiRoutes.SPACES}`).query({ datesToReserve: datesReserved_1 });
    });

    it('PUT /spaces should edit space by id', async () => {});

    it('DELETE /spaces should delete space from database', async () => {});

    it('Created appointments should relate to space', async () => {
        let space = await spaceModel.create(spaceData);

        space = await spaceModel.findOne({
            where: { id: space.id },
            raw: true,
            include: [
                { model: City, as: 'city' },
                { model: Appointment, as: 'appointments' },
            ],
        });

        const beginningDate_1 = createCustomDate('2020-12-15', space['city.timezone']);
        const endingDate_1 = createCustomDate('2020-12-20', space['city.timezone']);
        const beginningDate_2 = createCustomDate('2021-12-15', space['city.timezone']);
        const endingDate_2 = createCustomDate('2021-12-20', space['city.timezone']);

        const datesReserved_1: TDatesReserved = [
            { inclusive: true, value: beginningDate_1 },
            { inclusive: false, value: endingDate_1 },
        ];
        const datesReserved_2: TDatesReserved = [
            { inclusive: true, value: beginningDate_2 },
            { inclusive: false, value: endingDate_2 },
        ];

        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            datesReserved: datesReserved_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space.id,
            datesReserved: datesReserved_2,
        });

        const spaceFresh = await spaceModel.findOne({
            where: { id: space.id },
            include: { all: true },
            nest: true,
        });

        expect(spaceFresh['dataValues'].appointments).toBeTruthy();
        expect(spaceFresh['dataValues'].appointments.length).toBe(2);
        // NOTE перед записью аппоинтмента нужно проверить чтобы время было свободно
    });

    it('', async () => {
        // NOTE перед записью аппоинтмента нужно проверить чтобы время было свободно
    });
});
