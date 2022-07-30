"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const faker = require("faker");
const jwt = require("jsonwebtoken");
const user_model_1 = require("../models/user.model");
const lib_1 = require("./lib");
const enums_1 = require("../types/enums");
describe('Auth (e2e)', () => {
    let app;
    let server;
    let appConfig;
    let db;
    let userData;
    let userModel;
    let invalidUserData;
    beforeAll(async () => {
        appConfig = lib_1.createAppConfig();
        app = appConfig.app;
        db = appConfig.sequelize;
        invalidUserData = lib_1.createInvalidUserData();
        userModel = user_model_1.User;
        userData = lib_1.createUserData();
        server = (await lib_1.openTestEnv(appConfig)).server;
    });
    beforeEach(async () => { });
    afterEach(async () => {
        lib_1.clearDb(db);
        userData = lib_1.createUserData();
    });
    afterAll(async () => {
        await lib_1.closeTestEnv(db, server);
    });
    it('POST /auth/signup should create new user in db', async () => {
        const users = await userModel.findAll();
        expect(users.length).toBe(0);
        const res = await request(app).post(`${enums_1.ApiRoutes.AUTH}/signup`).send(userData);
        expect(res.status).toBe(201);
        const user = await userModel.findOne({ where: { email: userData.email } });
        expect(user).toBeDefined();
    });
    it('POST /auth/signup should put jwt into cookies', async () => {
        const res = await request(app).post(`${enums_1.ApiRoutes.AUTH}/signup`).send(userData);
        expect(res.status).toBe(201);
        const jwtCookie = res.headers['set-cookie'].find((cookie) => cookie.includes('jwt'));
        // const jwt = jwtCookie.match(/(?<=jwt=)[A-Za-z0-9-_=\.]+/)[0]; // NOTE эта строка на вес золота
        expect(jwtCookie).toBeDefined();
    });
    it('POST /auth/login should not allow users with invalid credentials', async () => {
        await userModel.findAll();
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.AUTH}/login`)
            .send({ email: userData.email, password: userData.password });
        expect(res.status).toBe(401);
    });
    it('POST /auth/login should allow users with valid credentials', async () => {
        await userModel.create(userData);
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.AUTH}/login`)
            .send({ email: userData.email, password: userData.password });
        expect(res.status).toBe(200);
    });
    it('/auth/signup password should be in a range of 8 - 25', async () => {
        userData.password = invalidUserData.passwordShort;
        userData.passwordConfirmation = invalidUserData.passwordShort;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.PASSWORD_LENGTH_VALIDATE, expect);
        userData.password = invalidUserData.passwordExceeding;
        userData.passwordConfirmation = invalidUserData.passwordExceeding;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.PASSWORD_LENGTH_VALIDATE, expect);
    });
    // NOTE tests for middleName
    it('/auth/signup passwords should match', () => {
        userData.passwordConfirmation = `${userData.passwordConfirmation}1`;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.PASSWORDS_DO_NOT_MATCH, expect);
    });
    it('/auth/signup name should be in a range of 2 and 25', () => {
        userData.name = invalidUserData.nameShort;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.NAME_LENGTH_VALIDATE, expect);
        userData.name = invalidUserData.nameExceeding;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.NAME_LENGTH_VALIDATE, expect);
    });
    it('/auth/signup surname should be in a range of 2 and 25', () => {
        userData.surname = invalidUserData.surnameShort;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.SURNAME_LENGTH_VALIDATE, expect);
        userData.surname = invalidUserData.surnameExceeding;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.SURNAME_LENGTH_VALIDATE, expect);
    });
    it('/auth/signup email should be in format of email', () => {
        userData.email = invalidUserData.email;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.IS_EMAIL_VALIDATE, expect);
    });
    it('/auth/signup should disallow to signup if password and passwordConfirmation are not provided', async () => {
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.AUTH}/signup`)
            .send({ email: userData.email, name: userData.name, surname: userData.surname });
        expect(res.status).toBe(enums_1.HttpStatus.BAD_REQUEST);
    });
    it('/auth/signup should disallow to signup if not all required data is provided', async () => {
        const res = await request(app).post(`${enums_1.ApiRoutes.AUTH}/signup`).send({
            name: userData.name,
            surname: userData.surname,
            password: userData.password,
            passwordConfirmation: userData.passwordConfirmation,
        });
    });
    it('/auth/signup passwords should containt at least 1 capital letter and 1 number', async () => { });
    it('/auth/signup passwords should containt at least 1 capital letter and 1 number', async () => { });
    it("PUT 'auth/passwordChange should check if old password is correct", async () => {
        const user = await userModel.create(userData);
        const token = await lib_1.createTokenAndSign({ id: user.id });
        const res_1 = await request(app)
            .put(`${enums_1.ApiRoutes.AUTH}/passwordChange`)
            .send({
            passwordData: {
                password: userData.password,
                passwordConfirmation: userData.passwordConfirmation,
                oldPassword: userData.password,
            },
        })
            .set('Cookie', [`jwt=${token}`]);
        expect(res_1.status).toBe(enums_1.HttpStatus.OK);
        const res_2 = await request(app)
            .put(`${enums_1.ApiRoutes.AUTH}/passwordChange`)
            .send({
            passwordData: {
                password: userData.password,
                passwordConfirmation: userData.passwordConfirmation,
                oldPassword: '1',
            },
        })
            .set('Cookie', [`jwt=${token}`]);
        expect(res_2.status).toBe(enums_1.HttpStatus.FORBIDDEN);
    });
    it("PUT 'auth/passwordChange should check if old password is not undefined", async () => {
        const user = await userModel.create(userData);
        const token = await lib_1.createTokenAndSign({ id: user.id });
        const res = await request(app)
            .put(`${enums_1.ApiRoutes.AUTH}/passwordChange`)
            .send({
            passwordData: {
                password: userData.password,
                passwordConfirmation: userData.passwordConfirmation,
                oldPassword: undefined,
            },
        })
            .set('Cookie', [`jwt=${token}`]);
        expect(res.status).toBe(enums_1.HttpStatus.BAD_REQUEST);
    });
    it("PUT 'auth/passwordRecovery should check if the token is recovery one", async () => {
        const user = await userModel.create(userData);
        const tokenWithRecovery = await lib_1.createTokenAndSign({ id: user.id, recovery: true });
        const tokenWithoutRecovery = await lib_1.createTokenAndSign({ id: user.id });
        const res_1 = await request(app)
            .put(`${enums_1.ApiRoutes.AUTH}/passwordRecovery`)
            .send({
            passwordData: {
                password: userData.password,
                passwordConfirmation: userData.passwordConfirmation,
            },
        })
            .set('Cookie', [`jwt=${tokenWithRecovery}`]);
        expect(res_1.status).toBe(enums_1.HttpStatus.OK);
        const res_2 = await request(app)
            .put(`${enums_1.ApiRoutes.AUTH}/passwordRecovery`)
            .send({
            passwordData: {
                password: userData.password,
                passwordConfirmation: userData.passwordConfirmation,
            },
        })
            .set('Cookie', [`jwt=${tokenWithoutRecovery}`]);
        expect(res_2.status).toBe(enums_1.HttpStatus.FORBIDDEN);
    });
    it("POST '/signup' should not allow to manually set confirmed field", async () => {
        userData.confirmed = true;
        const user = await userModel.create(userData, { fields: user_model_1.userCreateFields });
        expect(user.confirmed).toBeFalsy();
    });
    it("POST '/signup' should not allow to register with non cyrillic name", async () => {
        userData.name = faker.name.firstName();
        const res = await request(app).post(`${enums_1.ApiRoutes.AUTH}/signup`).send(userData);
        expect(res.status).toBe(enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
    });
    it("POST '/signup' should not allow to register with any symbol except '-'", async () => {
        userData.name = faker.name.firstName() + '_';
        const res = await request(app).post(`${enums_1.ApiRoutes.AUTH}/signup`).send(userData);
        expect(res.status).toBe(enums_1.HttpStatus.INTERNAL_SERVER_ERROR);
    });
    it('Unconfirmed user should be unable to access protected routes', async () => {
        let user;
        let token;
        user = await userModel.create(userData);
        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
        const spaceData = lib_1.createSpaceData(user.id, 1);
        const res_1 = await request(app)
            .post(`${enums_1.ApiRoutes.SPACES}`)
            .send(spaceData)
            .set('Authorization', `Bearer ${token}`);
        expect(res_1.status).toBe(enums_1.HttpStatus.CREATED);
        userData.confirmed = false;
        userData.email = faker.internet.email();
        user = await userModel.create(userData);
        token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY);
        const res_2 = await request(app)
            .post(`${enums_1.ApiRoutes.SPACES}`)
            .send(spaceData)
            .set('Authorization', `Bearer ${token}`);
        expect(res_2.status).toBe(enums_1.HttpStatus.FORBIDDEN);
    });
});
//# sourceMappingURL=auth.spec.js.map