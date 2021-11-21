import { SpaceSequelizeDao, spaceSequelizeDao } from '../daos/space.sequelize.dao';
import { Space } from '../models/space.model';
import { ErrorMessages, HttpStatus } from '../types/enums';
import AppError from './AppError';
import UtilFunctions from './UtilFunctions';

export class RouteProtector {
    private static readonly spaceModel: typeof Space = Space;
    private static readonly spaceDao: SpaceSequelizeDao = spaceSequelizeDao;

    private static readonly UtilFunctions = UtilFunctions;
    // TODO регистрация админов не должна быть доступна для каждого - возможно только авторизованный админ должен уметь это делатьы
    public static adminOnlyProtector = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        next();
    });

    public static spaceOwnerProtector = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: userId } = req.user;
        const { spaceId } = req.params;
        const space: Space = await this.spaceDao.findById(spaceId);

        if (space.userId !== userId) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.NOT_ENOUGH_RIGHTS);
        }

        req.space = {
            id: space.id,
        };

        next();
    });
}
