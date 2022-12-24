"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CorsConfig {
}
exports.default = CorsConfig;
CorsConfig.corsOptions = {
    origin: function (origin, callback) {
        if (CorsConfig.whiteList.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
};
CorsConfig.whiteList = ['http://www.spaceboo.ru', 'http://www.spaceboo.com'];
//# sourceMappingURL=cors.config.js.map