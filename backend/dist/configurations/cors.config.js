"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CorsConfig {
}
exports.default = CorsConfig;
CorsConfig.corsOptions = {
    origin: function (origin, callback) {
        if (!origin || CorsConfig.whiteList.indexOf(origin) !== -1) {
            console.log(origin);
            callback(null, true);
        }
        else {
            console.log(origin);
            callback(new Error('Not allowed by CORS.'));
        }
    },
};
CorsConfig.whiteList = ['http://www.spaceboo.ru', 'http://www.spaceboo.com'];
//# sourceMappingURL=cors.config.js.map