import * as jwt from 'jsonwebtoken';
import { appointmentSequelizeDao, AppointmentSequelizeDao } from '../daos/appointment.sequelize.dao';
import { SpaceSequelizeDao, spaceSequelizeDao } from '../daos/space.sequelize.dao';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import { Space } from '../models/space.model';
import { User, UserRoles, UserScopes } from '../models/user.model';
import { ErrorMessages, HttpStatus } from '../types/enums';
import AppError from './AppError';
import UtilFunctions from './UtilFunctions';

export class RouteProtector {
    private static readonly userModel: typeof User = User;

    private static readonly spaceDao: SpaceSequelizeDao = spaceSequelizeDao;
    private static readonly userDao: UserSequelizeDao = userSequelizeDao;
    private static readonly appointmentDao: AppointmentSequelizeDao = appointmentSequelizeDao;
    private static readonly jwt = jwt;
    private static readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    // TODO регистрация админов не должна быть доступна для каждого - возможно только авторизованный админ должен уметь это делатьы
    public static adminOnlyProtector = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: userId } = req.user;
        const user: User = await this.userDao.findById(userId);

        if (user.role !== UserRoles.ADMIN) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.NOT_ENOUGH_RIGHTS);
        }

        next();
    });

    // NOTE: if endpoints can be accessed both by users and admins
    public static adminOrSpaceOwnerProtector = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: userId } = req.user;
        const { spaceId } = req.params || req.body || req.query;

        const user: User = await this.userDao.findById(userId);
        const space: Space = await this.spaceDao.findById(spaceId);

        if (user.role !== UserRoles.ADMIN || space.userId !== user.id) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.NOT_ENOUGH_RIGHTS);
        }

        next();
    });

    public static spaceOwnerProtector = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: userId } = req.user;
        const { spaceId } = req.params || req.body || req.query;

        const space: Space = await this.spaceDao.findById(spaceId);

        if (space.userId !== userId) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.NOT_ENOUGH_RIGHTS);
        }

        req.space = {
            id: space.id,
        };

        next();
    });

    public static confirmedUserProtector = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const user = await this.userModel.scope(UserScopes.WITH_CONFIRMED).findOne({
            where: {
                id: req.user.id,
            },
        });

        if (!user.confirmed) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.VERIFY_ACCOUNT);
        }

        next();
    });

    // FIXME: this is realized in passport JWT but in case if we need to allow access for unconfirmed users through passport jwt then we need to use this one.
    public static passwordRecoveryProtector = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const token = req.cookies['jwt'];

        if (!jwt.verify(token, process.env.JWT_SECRET_KEY)) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.NOT_ENOUGH_RIGHTS);
        }

        const payload = this.jwt.decode(token) as jwt.JwtPayload;

        if (!payload.recovery) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.NOT_ENOUGH_RIGHTS);
        }

        const user = await this.userModel.findOne({ where: { id: payload.id } });

        if (!user) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
        }

        req.user = {
            id: user.id,
            recovery: true,
        };

        next();
    });

    public static userHasActiveAppointment = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;
        const { spaceId } = req.body;

        const hasActiveAppointment = await this.appointmentDao.userHasActiveAppointmentsForSpace(userId, spaceId);

        if (hasActiveAppointment) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.NOT_ENOUGH_RIGHTS);
        }

        next();
    });
}
