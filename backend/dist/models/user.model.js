"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserScopes = void 0;
const bcrypt = require("bcrypt");
const sequelize_typescript_1 = require("sequelize-typescript");
const enums_1 = require("../types/enums");
const AppError_1 = require("../utils/AppError");
const appointment_model_1 = require("./appointment.model");
var UserQueryExcludedAttributes;
(function (UserQueryExcludedAttributes) {
    UserQueryExcludedAttributes["PASSWORD"] = "password";
    UserQueryExcludedAttributes["PASSWORD_CONFIRMATION"] = "passwordConfirmation";
    UserQueryExcludedAttributes["FACEBOOK_ID"] = "facebookId";
    UserQueryExcludedAttributes["VKONTAKTE_ID"] = "vkontakteId";
    UserQueryExcludedAttributes["ODNOKLASSNIKI_ID"] = "odnoklassnikiId";
    UserQueryExcludedAttributes["CREATED_AT"] = "createdAt";
    UserQueryExcludedAttributes["UPDATED_AT"] = "updatedAt";
})(UserQueryExcludedAttributes || (UserQueryExcludedAttributes = {}));
var UserScopes;
(function (UserScopes) {
    UserScopes["WITH_PASSWORD"] = "withPassword";
})(UserScopes = exports.UserScopes || (exports.UserScopes = {}));
let User = class User extends sequelize_typescript_1.Model {
    static async hashPasswordAndRemovePasswordConfirmation(instance) {
        // NOTE probably here we need a check if password is provided or no - for example, for Facebook auth there's no password, but operations below still probably will be executed
        instance.password = await bcrypt.hash(instance.password, 10);
        instance.passwordConfirmation = undefined;
    }
    verifyPassword(instance) {
        return async (password) => {
            return bcrypt.compare(password, instance.password);
        };
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4, allowNull: false }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        validate: {
            len: {
                msg: enums_1.ErrorMessages.NAME_LENGTH_VALIDATE,
                args: [2, 25],
            },
            notNull: {
                msg: enums_1.ErrorMessages.REQUIRED_FIELDS_VALIDATE,
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        validate: {
            len: {
                msg: enums_1.ErrorMessages.NAME_LENGTH_VALIDATE,
                args: [2, 25],
            },
            notNull: {
                msg: enums_1.ErrorMessages.REQUIRED_FIELDS_VALIDATE,
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "surname", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        validate: {
            len: {
                msg: enums_1.ErrorMessages.MIDDLE_NAME_LENGTH_VALIDATE,
                args: [2, 25],
            },
            notNull: {
                msg: enums_1.ErrorMessages.REQUIRED_FIELDS_VALIDATE,
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "middleName", void 0);
__decorate([
    sequelize_typescript_1.Column({
        allowNull: false,
        validate: {
            isEmail: {
                msg: enums_1.ErrorMessages.IS_EMAIL_VALIDATE,
            },
            // notNull: {
            //     msg: ErrorMessages.REQUIRED_FIELDS_VALIDATE,
            // },
        },
        // unique: { name: 'email', msg: 'not uniqueeee' },
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    sequelize_typescript_1.Column({
        validate: {
            len: { msg: enums_1.ErrorMessages.PASSWORD_LENGTH_VALIDATE, args: [8, 25] },
            checkAvailability() {
                if (this.password !== this.passwordConfirmation) {
                    throw new AppError_1.default(enums_1.HttpStatus.BAD_REQUEST, enums_1.ErrorMessages.PASSWORDS_DO_NOT_MATCH_VALIDATE);
                }
            },
        },
    }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "passwordConfirmation", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "facebookId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "vkontakteId", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], User.prototype, "odnoklassnikiId", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => appointment_model_1.Appointment),
    __metadata("design:type", Array)
], User.prototype, "appointments", void 0);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    sequelize_typescript_1.BeforeCreate // === pre-hook
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User]),
    __metadata("design:returntype", Promise)
], User, "hashPasswordAndRemovePasswordConfirmation", null);
User = __decorate([
    sequelize_typescript_1.Table({
        timestamps: true,
        defaultScope: {
            attributes: {
                exclude: [
                    UserQueryExcludedAttributes.PASSWORD,
                    UserQueryExcludedAttributes.PASSWORD_CONFIRMATION,
                    UserQueryExcludedAttributes.FACEBOOK_ID,
                    UserQueryExcludedAttributes.VKONTAKTE_ID,
                    UserQueryExcludedAttributes.ODNOKLASSNIKI_ID,
                    UserQueryExcludedAttributes.CREATED_AT,
                    UserQueryExcludedAttributes.UPDATED_AT,
                ],
            },
        },
        scopes: {
            withPassword: {
                attributes: { exclude: [] },
            },
        },
    })
], User);
exports.User = User;
//# sourceMappingURL=user.model.js.map