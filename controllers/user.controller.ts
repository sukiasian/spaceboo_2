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
}

export const userController = SingletonFactory.produce<UserController>(UserController);
