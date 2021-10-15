import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

class UserController extends Singleton {
    private readonly dao: UserSequelizeDao = userSequelizeDao;

    public findUserById = UtilFunctions.catchAsync(async (req, res, next) => {
        return this.dao.findById('sdfsdfsdfsdfsf');
    });
}

export const userController = SingletonFactory.produce<UserController>(UserController);
