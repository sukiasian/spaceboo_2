"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const jwt = require("jsonwebtoken");
const user_model_1 = require("../models/user.model");
const lib_1 = require("./lib");
const enums_1 = require("../types/enums");
const email_verification_router_1 = require("../routes/email-verification.router");
const email_verification_model_1 = require("../models/email-verification.model");
describe('Email Verification (e2e)', () => {
    let app;
    let server;
    let applicationInstance;
    let db;
    let invalidUserData;
    let user;
    let userData;
    let userModel;
    let emailVerificationModel;
    beforeAll(async () => {
        applicationInstance = lib_1.createApplicationInstance();
        app = applicationInstance.app;
        db = applicationInstance.sequelize;
        invalidUserData = lib_1.createInvalidUserData();
        userModel = user_model_1.User;
        userData = lib_1.createUserData();
        emailVerificationModel = email_verification_model_1.EmailVerification;
        server = (await lib_1.openTestEnv(applicationInstance)).server;
    });
    beforeEach(async () => {
        user = await userModel.create(userData);
    });
    afterEach(async () => {
        lib_1.clearDb(db);
    });
    afterAll(async () => {
        await lib_1.closeTestEnv(db, server);
    });
    it('POST /emailVerification/:purpose should send an email to user email address', async () => {
        const res = await request(app).post(`${enums_1.ApiRoutes.EMAIL_VERIFICATION}/${email_verification_router_1.EmailPurpose[10]}`).send({
            email: user.email,
        });
        expect(res.status).toBe(enums_1.HttpStatus.OK);
    });
    it('POST /emailVerification should check if the 6-digit code is correct', async () => {
        const res_1 = await request(app).post(`${enums_1.ApiRoutes.EMAIL_VERIFICATION}/${email_verification_router_1.EmailPurpose[10]}`).send({
            email: user.email,
        });
        expect(res_1.status).toBe(enums_1.HttpStatus.OK);
        const emailVerification = await emailVerificationModel.findOne({
            where: {
                email: user.email,
            },
        });
        const code = emailVerification.code;
        const res_2 = await request(app).post(`${enums_1.ApiRoutes.EMAIL_VERIFICATION}`).send({
            currentCode: code,
            email: user.email,
        });
        expect(res_2.status).toBe(enums_1.HttpStatus.OK);
    });
    it('POST /emailVerification should put a temporary token in cookies', async () => {
        const res_1 = await request(app).post(`${enums_1.ApiRoutes.EMAIL_VERIFICATION}/${email_verification_router_1.EmailPurpose[10]}`).send({
            email: user.email,
        });
        expect(res_1.status).toBe(enums_1.HttpStatus.OK);
        const emailVerification = await emailVerificationModel.findOne({
            where: {
                email: user.email,
            },
        });
        const code = emailVerification.code;
        const res_2 = await request(app).post(`${enums_1.ApiRoutes.EMAIL_VERIFICATION}`).send({
            currentCode: code,
            email: user.email,
            recovery: true,
        });
        const token = res_2.headers['set-cookie'][0].match(/(?<=jwt=)[A-Za-z0-9-_=\.]+/)[0];
        const payload = jwt.decode(token);
        expect(payload.id).toBe(user.id);
    });
    it("POST /emailVerification should modify user's lastVerificationRequest if it doesn't exist and reject if the interval didn't expire", async () => { });
    // 1. пользователь с токеном получит письмо
    // 2. пользователь с req.body.email (восстанавливающий) получит письмо
    // 3. Пользователь без email не получит письмо (вылетит ошибка что email-а нету; токен в данном случае как раз не нужен)
    // 4. Если время истекло пользователь
    // 5. если пользователь
});
//# sourceMappingURL=email-verification.spec.js.map