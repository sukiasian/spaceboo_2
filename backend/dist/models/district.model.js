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
exports.District = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const region_model_1 = require("./region.model");
let District = class District extends sequelize_typescript_1.Model {
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.INTEGER }),
    __metadata("design:type", Number)
], District.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column({ type: sequelize_typescript_1.DataType.STRING }),
    __metadata("design:type", String)
], District.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.HasMany(() => region_model_1.Region),
    __metadata("design:type", Array)
], District.prototype, "regions", void 0);
District = __decorate([
    sequelize_typescript_1.Table({ timestamps: false })
], District);
exports.District = District;
//# sourceMappingURL=district.model.js.map