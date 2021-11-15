import * as express from 'express';
import * as path from 'path';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import { User } from '../models/user.model';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

class UserController extends Singleton {
    private readonly dao: UserSequelizeDao = userSequelizeDao;

    public findUserById = UtilFunctions.catchAsync(async (req, res, next): Promise<User> => {
        return this.dao.findById('sdfsdfsdfsdfsf');
    });

    public getUserAvatar = UtilFunctions.catchAsync(async (req, res: express.Response, next) => {
        // accept avatarUrl
        // find the avatar by req.body.avatarUrl

        res.sendFile(path.join(__dirname, `${req.user.id}`));
    });
}

export const userController = SingletonFactory.produce<UserController>(UserController);
