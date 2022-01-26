"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.applicationInstance = exports.Application = void 0;
const express = require("express");
const sequelize_typescript_1 = require("sequelize-typescript");
const cookieParser = require("cookie-parser");
const user_router_1 = require("./routes/user.router");
const space_router_1 = require("./routes/space.router");
const auth_router_1 = require("./routes/auth.router");
const appointment_router_1 = require("./routes/appointment.router");
const image_router_1 = require("./routes/image.router");
const email_verification_router_1 = require("./routes/email-verification.router");
const city_router_1 = require("./routes/city.router");
const enums_1 = require("./types/enums");
const error_controller_1 = require("./controllers/error.controller");
const Singleton_1 = require("./utils/Singleton");
const user_model_1 = require("./models/user.model");
const space_model_1 = require("./models/space.model");
const passport_config_1 = require("./configurations/passport.config");
const test_model_1 = require("./models/test.model");
const city_model_1 = require("./models/city.model");
const appointment_model_1 = require("./models/appointment.model");
const email_verification_model_1 = require("./models/email-verification.model");
class Application extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.app = express();
        this.passportConfig = passport_config_1.passportConfig;
        this.sequelize = new sequelize_typescript_1.Sequelize({
            dialect: 'postgres',
            dialectOptions: {
                multipleStatements: true,
            },
            host: process.env.host || 'localhost',
            port: Number.parseInt(process.env.DATABASE_PORT, 10) || 5432,
            username: process.env.DATABASE_USERNAME || 'postgres',
            password: process.env.DATABASE_PASSWORD || 'postgres',
            database: process.env.DATABASE_NAME || 'postgres',
            models: [city_model_1.City, user_model_1.User, space_model_1.Space, test_model_1.Test, appointment_model_1.Appointment, email_verification_model_1.EmailVerification],
            logging: false,
        });
    }
    configureApp() {
        this.app.use(express.json({ limit: '10Kb' })); // NOTE
        this.app.use(express.static('public'));
        this.app.use(cookieParser());
        this.app.use(this.passportConfig.initializePassport());
        this.app.use(enums_1.ApiRoutes.USERS, user_router_1.router);
        this.app.use(enums_1.ApiRoutes.AUTH, auth_router_1.router);
        this.app.use(enums_1.ApiRoutes.EMAIL_VERIFICATION, email_verification_router_1.router);
        this.app.use(enums_1.ApiRoutes.SPACES, space_router_1.router);
        this.app.use(enums_1.ApiRoutes.APPOINTMENTS, appointment_router_1.router);
        this.app.use(enums_1.ApiRoutes.IMAGES, image_router_1.router);
        this.app.use(enums_1.ApiRoutes.CITIES, city_router_1.router);
        this.app.use(error_controller_1.default);
    }
    setupPassport() {
        this.passportConfig.configurePassport();
    }
}
exports.Application = Application;
exports.applicationInstance = Singleton_1.SingletonFactory.produce(Application);
exports.applicationInstance.setupPassport();
exports.applicationInstance.configureApp();
exports.app = exports.applicationInstance.app;
//# sourceMappingURL=App.js.map