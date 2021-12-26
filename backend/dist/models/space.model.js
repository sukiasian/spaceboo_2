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
exports.Space = exports.SpaceType = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const city_model_1 = require("./city.model");
const appointment_model_1 = require("./appointment.model");
const user_model_1 = require("./user.model");
var SpaceType;
(function (SpaceType) {
    SpaceType["FLAT"] = "\u041A\u0432\u0430\u0440\u0442\u0438\u0440\u0430";
    SpaceType["HOUSE"] = "\u0416\u0438\u043B\u043E\u0439 \u0434\u043E\u043C";
})(SpaceType = exports.SpaceType || (exports.SpaceType = {}));
let Space = class Space extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], Space.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Space.prototype, "address", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], Space.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.SMALLINT }),
    __metadata("design:type", Number)
], Space.prototype, "roomsNumber", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => city_model_1.City),
    sequelize_typescript_1.Column({ allowNull: false }),
    __metadata("design:type", Number)
], Space.prototype, "cityId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => city_model_1.City),
    __metadata("design:type", city_model_1.City)
], Space.prototype, "city", void 0);
__decorate([
    sequelize_typescript_1.Column({ defaultValue: false }),
    __metadata("design:type", Boolean)
], Space.prototype, "lockerConnected", void 0);
__decorate([
    sequelize_typescript_1.ForeignKey(() => user_model_1.User),
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.UUID }),
    __metadata("design:type", String)
], Space.prototype, "userId", void 0);
__decorate([
    sequelize_typescript_1.BelongsTo(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], Space.prototype, "user", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) }),
    __metadata("design:type", Array)
], Space.prototype, "imagesUrl", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(200) }),
    __metadata("design:type", String)
], Space.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.ARRAY(sequelize_typescript_1.DataType.STRING) }),
    __metadata("design:type", Array)
], Space.prototype, "facilities", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => appointment_model_1.Appointment),
    __metadata("design:type", Array)
], Space.prototype, "appointments", void 0);
Space = __decorate([
    sequelize_typescript_1.Table({ timestamps: true })
], Space);
exports.Space = Space;
//# sourceMappingURL=space.model.js.map