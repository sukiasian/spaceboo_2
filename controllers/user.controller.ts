import * as express from 'express';
import * as path from 'path';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import { User } from '../models/user.model';
import { HttpStatus } from '../types/enums';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

class UserController extends Singleton {
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;
    private readonly dao: UserSequelizeDao = userSequelizeDao;

    public updateUserAvatar = UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        await this.dao.updateUserAvatar(req.user.id, req.file.filename);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK);
    });
}

export const userController = SingletonFactory.produce<UserController>(UserController);
