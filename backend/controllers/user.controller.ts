import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import { User } from '../models/user.model';
import { ErrorMessages, HttpStatus, ResponseMessages } from '../types/enums';
import AppError from '../utils/AppError';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

class UserController extends Singleton {
    private readonly dao: UserSequelizeDao = userSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public editUser = UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: userId } = req.user;

        // TODO чтобы решить проблему раздвоения методов (пароль можно изменить и с помощью даного метода и с помощью )
        // кстати при смене пароля нужно учитывать старый пароль
        await this.dao.editUser(userId, req.body);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.DATA_UPDATED);
    });

    public getCurrentUser = UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const user = await this.dao.getCurrentUserById(req.user.id);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, user);
    });

    public getUserById = UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const user: User = await this.dao.getUserById(req.params.userId);

        // TODO use insensitive fields for getting user

        if (!user) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
        }

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, user);
    });
}

export const userController = SingletonFactory.produce<UserController>(UserController);
