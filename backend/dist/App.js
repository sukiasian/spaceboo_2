"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.applicationInstance = exports.Application = void 0;
const express = require("express");
const sequelize_typescript_1 = require("sequelize-typescript");
const dotenv = require("dotenv");
const user_router_1 = require("./routes/user.router");
const space_router_1 = require("./routes/space.router");
const auth_router_1 = require("./routes/auth.router");
const appointment_router_1 = require("./routes/appointment.router");
const enums_1 = require("./types/enums");
const error_controller_1 = require("./controllers/error.controller");
const Singleton_1 = require("./utils/Singleton");
const user_model_1 = require("./models/user.model");
const space_model_1 = require("./models/space.model");
const passport_config_1 = require("./configurations/passport.config");
const test_model_1 = require("./models/test.model");
const city_model_1 = require("./models/city.model");
const appointment_model_1 = require("./models/appointment.model");
dotenv.config();
class Application extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.app = express();
        this.passportConfig = passport_config_1.passportConfig;
        this.sequelize = new sequelize_typescript_1.Sequelize({
            dialect: 'postgres',
            host: process.env.host || 'localhost',
            port: Number.parseInt(process.env.DATABASE_PORT, 10) || 5432,
            username: process.env.DATABASE_USERNAME || 'postgres',
            password: process.env.DATABASE_PASSWORD || 'postgres',
            database: process.env.DATABASE_NAME || 'postgres',
            models: [city_model_1.City, user_model_1.User, space_model_1.Space, test_model_1.Test, appointment_model_1.Appointment],
        });
    }
    configureApp() {
        // this.app.use(express.cookieParser());
        this.app.use(express.json({ limit: '10Kb' })); // NOTE
        this.app.use(express.static('public'));
        this.app.use(this.passportConfig.initializePassport());
        this.app.use(enums_1.ApiRoutes.USERS, user_router_1.router);
        this.app.use(enums_1.ApiRoutes.AUTH, auth_router_1.router);
        this.app.use(enums_1.ApiRoutes.SPACES, space_router_1.router);
        this.app.use(enums_1.ApiRoutes.APPOINTMENTS, appointment_router_1.router);
        this.app.use(error_controller_1.default);
    }
    setupPassport() {
        // 1. извлекает из req.body username, password. 2. ищет пользователя по юзернейму и сверяет пароль по password. 3. если находит то пропускает вперед, соответственно разделяет jwt в дальнейшем уже после пропуска вперед,то это авторизация. А вот passport jwt это аутентификация
        // this.passportConfig.userSerialization();
        this.passportConfig.configurePassport();
    }
}
exports.Application = Application;
exports.applicationInstance = Singleton_1.SingletonFactory.produce(Application);
exports.applicationInstance.setupPassport();
exports.applicationInstance.configureApp();
exports.app = exports.applicationInstance.app;
//# sourceMappingURL=App.js.map