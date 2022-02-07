import * as express from 'express';
import * as path from 'path';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import { User } from '../models/user.model';
import { ErrorMessages, HttpStatus, ResponseMessages } from '../types/enums';
import AppError from '../utils/AppError';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

class UserController extends Singleton {
    private readonly dao: UserSequelizeDao = userSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public editUser = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: userId } = req.user;
        const { userEditData } = req.body;

        // TODO чтобы решить проблему раздвоения методов (пароль можно изменить и с помощью даного метода и с помощью )
        // кстати при смене пароля нужно учитывать старый пароль
        await this.dao.editUser(userId, userEditData);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.DATA_UPDATED);
    });

    public getCurrentUser = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const user = await this.dao.getCurrentUserById(req.user.id);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, user);
    });

    public getUserById = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const user: User = await this.dao.getUserById(req.params.userId);

        // TODO use insensitive fields for getting user

        if (!user) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
        }

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, user);
    });
}

export const userController = SingletonFactory.produce<UserController>(UserController);
