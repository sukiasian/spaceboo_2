"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./App");
const logger_1 = require("./loggers/logger");
const process = require("process");
const enums_1 = require("./types/enums");
const UtilFunctions_1 = require("./utils/UtilFunctions");
const connectToDb_1 = require("./database/connectToDb");
const PORT = process.env.PORT || 8000;
(async () => {
    await connectToDb_1.default(App_1.applicationInstance.sequelize);
    const server = App_1.app.listen(PORT, () => {
        logger_1.default.log({
            level: 'info',
            message: `Server is listening on ${PORT}`,
        });
        if (process.env.NODE_ENV === enums_1.Environment.PRODUCTION) {
            process.send('Server is ready');
        }
    });
    UtilFunctions_1.default.exitHandler(server);
})();
//# sourceMappingURL=server.js.map