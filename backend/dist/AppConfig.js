"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appConfig = exports.AppConfig = void 0;
const express = require("express");
const sequelize_typescript_1 = require("sequelize-typescript");
const cookieParser = require("cookie-parser");
const path = require("path");
const user_router_1 = require("./routes/user.router");
const space_router_1 = require("./routes/space.router");
const auth_router_1 = require("./routes/auth.router");
const appointment_router_1 = require("./routes/appointment.router");
const image_router_1 = require("./routes/image.router");
const email_verification_router_1 = require("./routes/email-verification.router");
const city_router_1 = require("./routes/city.router");
const locker_router_1 = require("./routes/locker.router");
const locker_request_router_1 = require("./routes/locker-request.router");
const ttlock_router_1 = require("./routes/ttlock.router");
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
const cors = require("cors");
const cors_config_1 = require("./configurations/cors.config");
const helmet_1 = require("helmet");
const locker_model_1 = require("./models/locker.model");
const locker_request_model_1 = require("./models/locker-request.model");
class AppConfig extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
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
            models: [district_model_1.District, region_model_1.Region, city_model_1.City, user_model_1.User, space_model_1.Space, appointment_model_1.Appointment, email_verification_model_1.EmailVerification, locker_model_1.Locker, locker_request_model_1.LockerRequest],
            logging: false,
        });
        this.passportConfig = passport_config_1.passportConfig;
        this.corsConfig = cors_config_1.default;
        this.configureApp = () => {
            if (process.env.NODE_ENV === enums_1.Environment.PRODUCTION) {
                this.app.use(cors(this.corsConfig.corsOptions));
            }
            this.app.use((0, helmet_1.default)());
            this.app.use(express.json({ limit: '10Kb' }));
            this.app.use(express.static('assets/images'));
            this.app.use(cookieParser());
            this.app.use(this.passportConfig.initializePassport());
            this.app.use(enums_1.ApiRoutes.USERS, user_router_1.router);
            this.app.use(enums_1.ApiRoutes.AUTH, auth_router_1.router);
            this.app.use(enums_1.ApiRoutes.EMAIL_VERIFICATION, email_verification_router_1.router);
            this.app.use(enums_1.ApiRoutes.SPACES, space_router_1.router);
            this.app.use(enums_1.ApiRoutes.APPOINTMENTS, appointment_router_1.router);
            this.app.use(enums_1.ApiRoutes.LOCKERS, locker_router_1.router);
            this.app.use(enums_1.ApiRoutes.LOCKER_REQUESTS, locker_request_router_1.router);
            this.app.use(enums_1.ApiRoutes.TTLOCK, ttlock_router_1.router);
            this.app.use(enums_1.ApiRoutes.IMAGES, image_router_1.router);
            this.app.use(enums_1.ApiRoutes.CITIES, city_router_1.router);
            if (process.env.NODE_ENV === 'production') {
                this.app.use('/', express.static(path.resolve('../frontend', 'build')));
                this.app.get('*', (req, res) => {
                    res.sendFile(path.resolve('../frontend', 'build', 'index.html'));
                });
            }
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
//# sourceMappingURL=AppConfig.js.map