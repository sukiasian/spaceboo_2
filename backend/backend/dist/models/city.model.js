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
exports.City = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
let City = class City extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.AutoIncrement,
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], City.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(255) }),
    __metadata("design:type", String)
], City.prototype, "address", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], City.prototype, "postal_code", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(255) }),
    __metadata("design:type", String)
], City.prototype, "country", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(255) }),
    __metadata("design:type", String)
], City.prototype, "federal_district", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(255) }),
    __metadata("design:type", String)
], City.prototype, "region_type", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(255) }),
    __metadata("design:type", String)
], City.prototype, "region", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(255) }),
    __metadata("design:type", String)
], City.prototype, "area_type", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(255) }),
    __metadata("design:type", String)
], City.prototype, "area", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(255) }),
    __metadata("design:type", String)
], City.prototype, "city_type", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(255) }),
    __metadata("design:type", String)
], City.prototype, "city", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.CHAR(255) }),
    __metadata("design:type", String)
], City.prototype, "timezone", void 0);
__decorate([
    sequelize_typescript_1.Column({ defaultValue: false }),
    __metadata("design:type", Boolean)
], City.prototype, "supports_locker", void 0);
City = __decorate([
    sequelize_typescript_1.Table({ timestamps: false })
], City);
exports.City = City;
//# sourceMappingURL=city.model.js.map