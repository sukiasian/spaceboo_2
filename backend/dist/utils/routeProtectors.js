"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_controller_1 = require("../controllers/user.controller");
class RouteProtectors {
    constructor() {
        this.userController = user_controller_1.userController;
    }
    protectUsers(req, res, next) {
        // const user = this.userController.dao; //.findById<User>()
        // NOTE probably SWITCH CASE construction for every type of user - both facebook, google, ok, vk, local.
        if (req.headers.authorization.someToken === 'user.facebookId') {
        }
    }
}
exports.default = RouteProtectors;
//# sourceMappingURL=routeProtectors.js.map