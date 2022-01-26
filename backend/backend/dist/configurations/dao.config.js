"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dao = void 0;
const Singleton_1 = require("../utils/Singleton");
class Dao extends Singleton_1.Singleton {
    async findById(userId, raw = true) {
        return this.model.findOne({ raw: raw, where: { id: userId } });
    }
}
exports.Dao = Dao;
//# sourceMappingURL=dao.config.js.map