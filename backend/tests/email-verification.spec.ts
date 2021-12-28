import * as express from 'express';
import * as request from 'supertest';
import * as jwt from 'jsonwebtoken';
import { Application } from '../App';
import { User } from '../models/user.model';
import {
    clearDb,
    closeTestEnv,
    createApplicationInstance,
    createInvalidUserData,
    createUserData,
    openTestEnv,
} from './lib';
import { Sequelize } from 'sequelize-typescript';
import { ApiRoutes, HttpStatus } from '../types/enums';
import { EmailPurpose } from '../routes/email-verification.router';
import { EmailVerification } from '../models/email-verification.model';

describe('Email Verification (e2e)', () => {
    let app: express.Express;
    let server: any;
    let applicationInstance: Application;
    let db: Sequelize;
    let invalidUserData: any;
    let user: User;
    let userData: any;
    let userModel: typeof User;
    let emailVerificationModel: typeof EmailVerification;

    beforeAll(async () => {
        applicationInstance = createApplicationInstance();

        app = applicationInstance.app;
        db = applicationInstance.sequelize;
        invalidUserData = createInvalidUserData();
        userModel = User;
        userData = createUserData();
        emailVerificationModel = EmailVerification;

        server = (await openTestEnv(applicationInstance)).server;
    });
    beforeEach(async () => {
        user = await userModel.create(userData);
    });

    afterEach(async () => {
        clearDb(db);
    });

    afterAll(async () => {
        await closeTestEnv(db, server);
    });

    it('POST /emailVerification/:purpose should send an email to user email address', async () => {
        const res = await request(app).post(`${ApiRoutes.EMAIL_VERIFICATION}/${EmailPurpose[10]}`).send({
            email: user.email,
        });

        expect(res.status).toBe(HttpStatus.OK);
    });

    it('POST /emailVerification should check if the 6-digit code is correct', async () => {
        const res_1 = await request(app).post(`${ApiRoutes.EMAIL_VERIFICATION}/${EmailPurpose[10]}`).send({
            email: user.email,
        });

        expect(res_1.status).toBe(HttpStatus.OK);

        const emailVerification = await emailVerificationModel.findOne({
            where: {
                email: user.email,
            },
        });
        const code = emailVerification.code;
        const res_2 = await request(app).get(`${ApiRoutes.EMAIL_VERIFICATION}`).send({
            currentCode: code,
            email: user.email,
        });

        expect(res_2.status).toBe(HttpStatus.OK);
    });

    it('POST /emailVerification should put a temporary token in cookies', async () => {
        const res_1 = await request(app).post(`${ApiRoutes.EMAIL_VERIFICATION}/${EmailPurpose[10]}`).send({
            email: user.email,
        });

        expect(res_1.status).toBe(HttpStatus.OK);

        const emailVerification = await emailVerificationModel.findOne({
            where: {
                email: user.email,
            },
        });
        const code = emailVerification.code;
        // FIXME POST!!! NOT GET!!!
        const res_2 = await request(app).post(`${ApiRoutes.EMAIL_VERIFICATION}`).send({
            currentCode: code,
            email: user.email,
        });
        const token = res_2.headers['set-cookie'][0].match(/(?<=jwt=)[A-Za-z0-9-_=\.]+/)[0];
        const payload = jwt.decode(token) as jwt.JwtPayload;

        expect(payload.id).toBe(user.id);
    });
});
