"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cron = require("node-cron");
const NodeCronFunctions_1 = require("./utils/NodeCronFunctions");
const setCrons = () => {
    cron.schedule('* * 4 * *', configureCronsPromises, {
        scheduled: true,
        timezone: 'Europe/Moscow',
    });
};
const configureCronsPromises = () => {
    Promise.allSettled([
        NodeCronFunctions_1.nodeCronFunctions.archiveOutdatedAppointments,
        NodeCronFunctions_1.nodeCronFunctions.removeOutdatedEmailsFromDb,
        NodeCronFunctions_1.nodeCronFunctions.removeOutdatedSpaceImagesFromStorage,
        NodeCronFunctions_1.nodeCronFunctions.removeOutdatedUserAvatarsFromStorage,
    ]);
};
exports.default = setCrons;
//# sourceMappingURL=crons.js.map