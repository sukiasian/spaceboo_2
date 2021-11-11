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
import { Appointment, TIsoDatesReserved } from '../models/appointment.model';
import { City } from '../models/city.model';
import UtilFunctions from '../utils/UtilFunctions';
import { SpaceQuerySortFields } from '../daos/space.sequelize.dao';

describe('Space (e2e)', () => {
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
    let isoDatesToReserve_1: TIsoDatesReserved;
    let isoDatesToReserve_2: TIsoDatesReserved;
    let isoDatesToReserve_3: TIsoDatesReserved;
    let space_1: Space;
    let space_2: Space;

    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });

        isoDatesToReserve_1 = UtilFunctions.createIsoDatesRangeToCreateAppointments(
            '2020-12-15',
            '14:00',
            '2020-12-20',
            '12:00'
        );
        isoDatesToReserve_2 = UtilFunctions.createIsoDatesRangeToCreateAppointments(
            '2021-12-15',
            '14:00',
            '2021-12-20',
            '12:00'
        );
        isoDatesToReserve_3 = UtilFunctions.createIsoDatesRangeToCreateAppointments(
            '2022-12-15',
            '14:00',
            '2022-12-20',
            '12:00'
        );
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
        city_2 = await cityModel.findOne({ where: { city: 'Краснодар' } });
        user = await userModel.create(userData);
        spaceData = createSpaceData(user.id, city.id, 1500);
        spaceData_2 = createSpaceData(user.id, city_2.id);
        token = await createTokenAndSign(user.id);
        try {
            space_1 = await spaceModel.create(spaceData);
        } catch (err) {
            console.log(err, 'errrrrr');
        }
        space_1 = await spaceModel.findOne({
            where: { id: space_1.id },
            include: [cityModel, appointmentModel],
        });
        space_2 = await spaceModel.create(spaceData_2);
        space_2 = await spaceModel.findOne({ where: { id: space_2.id }, include: [cityModel, appointmentModel] });
    });

    afterEach(async () => {
        clearDb(db);
        userData = createUserData();
    });

    afterAll(async () => {
        await closeTestEnv(db, server);
    });

    it('POST /spaces should create a space', async () => {
        await spaceModel.destroy({ truncate: true, cascade: true });

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

    it('Created appointments should relate to space', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });

        const spaceFresh = await spaceModel.findOne({
            where: { id: space_1.id },
            include: { all: true },
            nest: true,
        });

        expect(spaceFresh[SequelizeModelProps.DATA_VALUES].appointments).toBeTruthy();
        expect(spaceFresh[SequelizeModelProps.DATA_VALUES].appointments.length).toBe(2);
    });

    it('GET /spaces should get all spaces by city', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });

        const res = await request(app).get(`${ApiRoutes.SPACES}`).query({
            cityId: space_2.cityId,
        });

        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].cityId).toBe(space_2.cityId);
    });

    ///// 2️⃣
    it('GET /spaces should get all spaces by dates to reserve', async () => {
        // FIXME if appointment already overlaps then we should be unable to create a new one
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_3,
        });

        const res = await request(app).get(`${ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2020-12-15,2020-12-20',
            timesToReserveQuery: '13:00,12:00',
        });

        expect(res.body.data.length).toBe(1);
        expect(res.body.data[0].id).toBe(space_2.id);
    });

    ///// 3️⃣
    it('GET /spaces should get all spaces without query strings', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });

        const res = await request(app).get(`${ApiRoutes.SPACES}`);

        expect(res.body.data.length).toBe(2);
    });
    ///// 4️⃣
    it('GET /spaces should get all spaces with city and dates to reserve queries', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });

        const res_1 = await request(app).get(`${ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2025-12-15,2025-12-20',
            timesToReserveQuery: '13:00,12:00',
            cityId: space_1.cityId,
        });
        const res_2 = await request(app).get(`${ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2025-12-15,2025-12-20',
            timesToReserveQuery: '13:00,12:00',
            cityId: space_2.cityId,
        });
        const res_3 = await request(app).get(`${ApiRoutes.SPACES}`).query({
            datesToReserveQuery: '2020-12-15,2020-12-20',
            timesToReserveQuery: '13:00,12:00',
            cityId: space_1.cityId,
        });

        expect(res_1.body.data.length).toBe(1);
        expect(res_2.body.data.length).toBe(1);
        expect(res_3.body.data.length).toBe(0);
    });

    /// 5️⃣
    it('GET /spaces should get all spaces should be able to sort', async () => {
        // NOTE put everything in beforeEach ?
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_2.id,
            isoDatesReserved: isoDatesToReserve_2,
        });

        const res_1 = await request(app).get(`${ApiRoutes.SPACES}`).query({
            sortBy: SpaceQuerySortFields.PRICEUP,
        });

        expect(res_1.body.data[0].pricePerNight < res_1.body.data[1].pricePerNight);

        const res_2 = await request(app).get(`${ApiRoutes.SPACES}`).query({
            sortBy: SpaceQuerySortFields.PRICEDOWN,
        });

        expect(res_2.body.data[0].pricePerNight > res_2.body.data[1].pricePerNight);
    });

    it('PUT /spaces should edit space by id', async () => {
        // get spaceId and check if the userId in space === req.user.id
        // if yes, then accept changes (for images we need a separate route)
        //
    });

    it('DELETE /spaces should delete space from database', async () => {});

    it('Created appointments should relate to space', async () => {
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_1,
        });
        await appointmentModel.create({
            userId: user.id,
            spaceId: space_1.id,
            isoDatesReserved: isoDatesToReserve_2,
        });

        const spaceFresh = await spaceModel.findOne({
            where: { id: space_1.id },
            include: { all: true },
            nest: true,
        });

        expect(spaceFresh[SequelizeModelProps.DATA_VALUES].appointments).toBeTruthy();
        expect(spaceFresh[SequelizeModelProps.DATA_VALUES].appointments.length).toBe(2);
    });
});
