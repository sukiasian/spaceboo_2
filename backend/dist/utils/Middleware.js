"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Middleware = void 0;
const jwt = require("jsonwebtoken");
const user_model_1 = require("../models/user.model");
const enums_1 = require("../types/enums");
const AppError_1 = require("./AppError");
const UtilFunctions_1 = require("./UtilFunctions");
class Middleware {
}
exports.Middleware = Middleware;
_a = Middleware;
Middleware.userModel = user_model_1.User;
Middleware.utilFunctions = UtilFunctions_1.default;
Middleware.retrieveEmailFromRequest = _a.utilFunctions.catchAsync(async (req, res, next) => {
    const token = req.cookies['jwt'];
    let email;
    let user;
    if (token) {
        const payload = jwt.decode(token);
        user = await _a.userModel.scope(user_model_1.UserScopes.PUBLIC).findOne({ where: { id: payload.id } });
    }
    else {
        email = req.body.email;
        user = await _a.userModel.findOne({
            where: {
                email,
            },
        });
        if (!email) {
            throw new AppError_1.default(enums_1.HttpStatus.BAD_REQUEST, enums_1.ErrorMessages.EMAIL_IS_EMPTY);
        }
    }
    if (!user) {
        throw new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, enums_1.ErrorMessages.USER_NOT_FOUND);
    }
    res.locals = {
        user,
    };
    next();
});
//# sourceMappingURL=Middleware.js.map