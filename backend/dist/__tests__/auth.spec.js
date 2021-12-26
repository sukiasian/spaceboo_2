"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("supertest");
const dotenv = require("dotenv");
const user_model_1 = require("../models/user.model");
const lib_1 = require("./lib");
const enums_1 = require("../types/enums");
describe('Auth (e2e)', () => {
    let app;
    let server;
    let applicationInstance;
    let db;
    let userData;
    let user;
    let userModel;
    let invalidUserData;
    beforeAll(async () => {
        dotenv.config({ path: '../test.env' });
        applicationInstance = lib_1.createApplicationInstance();
        app = applicationInstance.app;
        db = applicationInstance.sequelize;
        invalidUserData = lib_1.createInvalidUserData();
        userModel = user_model_1.User;
        userData = lib_1.createUserData();
        // await connectToDb(applicationInstance.sequelize);
        server = (await lib_1.openTestEnv(applicationInstance)).server;
    });
    beforeEach(async () => {
        // user = await userModel.create(userData);
    });
    afterEach(async () => {
        // await User.destroy();
        // await db.drop();
        // await User.destroy({ truncate: true });
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
        expect(user).not.toBeNull();
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
    it('/auth/signup passwords should match', () => {
        userData.passwordConfirmation = `${userData.passwordConfirmation}1`;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.PASSWORDS_DO_NOT_MATCH_VALIDATE, expect);
    });
    it('/auth/signup name should be in a range of 2 and 25', () => {
        userData.name = invalidUserData.nameShort;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.NAME_LENGTH_VALIDATE, expect);
        userData.name = invalidUserData.nameExceeding;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.NAME_LENGTH_VALIDATE, expect);
    });
    it('/auth/signup surname should be in a range of 2 and 25', () => {
        userData.surname = invalidUserData.surnameShort;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.NAME_LENGTH_VALIDATE, expect);
        userData.surname = invalidUserData.surnameExceeding;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.NAME_LENGTH_VALIDATE, expect);
    });
    it('/auth/signup email should be in format of email', () => {
        userData.email = invalidUserData.email;
        lib_1.testUserValidationByMessages(userModel, userData, enums_1.ErrorMessages.IS_EMAIL_VALIDATE, expect);
    });
    it('/auth/signup should disallow to signup if password is not provided', async () => {
        const res = await request(app)
            .post(`${enums_1.ApiRoutes.AUTH}/signup`)
            .send({ email: userData.email, name: userData.name, surname: userData.surname });
        expect(res.status).toBe(enums_1.HttpStatus.BAD_REQUEST);
    });
    it('/auth/signup passwords should containt at least 1 capital letter and 1 number', async () => { });
    // check route protectors ?
});
//# sourceMappingURL=auth.spec.js.map