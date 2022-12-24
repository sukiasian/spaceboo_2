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
exports.Locker = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const crypto = require("crypto");
const space_model_1 = require("./space.model");
let Locker = class Locker extends sequelize_typescript_1.Model {
    static async hashPasswordAndRemovePasswordConfirmation(instance) {
        if (instance.ttlockPassword) {
            instance.ttlockPassword = String(crypto.createHash('md5').update(instance.ttlockPassword));
        }
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.INTEGER, allowNull: false }),
    __metadata("design:type", Number)
], Locker.prototype, "id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => space_model_1.Space),
    (0, sequelize_typescript_1.Column)({ type: sequelize_typescript_1.DataType.UUID, allowNull: false, unique: true }),
    __metadata("design:type", String)
], Locker.prototype, "spaceId", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => space_model_1.Space),
    __metadata("design:type", space_model_1.Space)
], Locker.prototype, "space", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Locker.prototype, "ttlockEmail", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Locker.prototype, "ttlockPassword", void 0);
__decorate([
    sequelize_typescript_1.BeforeUpdate,
    sequelize_typescript_1.BeforeCreate // === pre-hook
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Locker]),
    __metadata("design:returntype", Promise)
], Locker, "hashPasswordAndRemovePasswordConfirmation", null);
Locker = __decorate([
    (0, sequelize_typescript_1.Table)({ timestamps: true })
], Locker);
exports.Locker = Locker;
//# sourceMappingURL=locker.model.js.map