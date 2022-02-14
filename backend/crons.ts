import * as cron from 'node-cron';
import { nodeCronFunctions } from './utils/NodeCronFunctions';

const setCrons = () => {
    cron.schedule('* * 4 * *', configureCronsPromises, {
        scheduled: true,
        timezone: 'Europe/Moscow',
    });
};
const configureCronsPromises = (): void => {
    Promise.allSettled([
        nodeCronFunctions.archiveOutdatedAppointments,
        nodeCronFunctions.removeOutdatedEmailsFromDb,
        nodeCronFunctions.removeOutdatedSpaceImagesFromStorage,
        nodeCronFunctions.removeOutdatedUserAvatarsFromStorage,
    ]);
};

export default setCrons;
