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
exports.Appointment = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const space_model_1 = require("./space.model");
const user_model_1 = require("./user.model");
let Appointment = class Appointment extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, defaultValue: sequelize_typescript_1.DataType.UUIDV4 }),
    __metadata("design:type", String)
], Appointment.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({
        type: sequelize_typescript_1.DataType.RANGE(sequelize_typescript_1.DataType.DATE),
    }),
    __metadata("design:type", Array)
], Appointment.prototype, "isoDatesReserved", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => space_model_1.Space),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }),
    __metadata("design:type", String)
], Appointment.prototype, "spaceId", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => user_model_1.User),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID }),
    __metadata("design:type", String)
], Appointment.prototype, "userId", void 0);
__decorate([
    (0, sequelize_typescript_1.Column)({ defaultValue: false }),
    __metadata("design:type", Boolean)
], Appointment.prototype, "archived", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => space_model_1.Space),
    __metadata("design:type", space_model_1.Space)
], Appointment.prototype, "space", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], Appointment.prototype, "user", void 0);
Appointment = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true })
], Appointment);
exports.Appointment = Appointment;
//# sourceMappingURL=appointment.model.js.map