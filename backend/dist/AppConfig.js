"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.AppConfig = void 0;
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
const city_model_1 = require("./models/city.model");
const appointment_model_1 = require("./models/appointment.model");
const email_verification_model_1 = require("./models/email-verification.model");
const district_model_1 = require("./models/district.model");
const region_model_1 = require("./models/region.model");
class AppConfig extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.passportConfig = passport_config_1.passportConfig;
        this.app = express();
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
            models: [district_model_1.District, region_model_1.Region, city_model_1.City, user_model_1.User, space_model_1.Space, appointment_model_1.Appointment, email_verification_model_1.EmailVerification],
            logging: false,
        });
        this.configureApp = () => {
            this.app.use(express.json({ limit: '10Kb' })); // NOTE
            this.app.use(express.static('assets/images'));
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
        };
        this.setupPassport = () => {
            this.passportConfig.configurePassport();
        };
    }
}
exports.AppConfig = AppConfig;
exports.appConfig = Singleton_1.SingletonFactory.produce(AppConfig);
exports.appConfig.setupPassport();
exports.appConfig.configureApp();
// export const app = appConfig.app;
//# sourceMappingURL=AppConfig.js.map