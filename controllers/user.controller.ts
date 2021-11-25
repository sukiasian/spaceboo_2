import * as express from 'express';
import * as path from 'path';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import { User } from '../models/user.model';
import { HttpStatus, ResponseMessages } from '../types/enums';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

class UserController extends Singleton {
    private readonly dao: UserSequelizeDao = userSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public editUser = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: userId } = req.user;
        const { userEditData } = req.body;

        await this.dao.editUser(userId, userEditData);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.DATA_UPDATED);
    });
}

export const userController = SingletonFactory.produce<UserController>(UserController);
