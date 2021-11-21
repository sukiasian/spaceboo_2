import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { spaceSequelizeDao, SpaceSequelizeDao } from '../daos/space.sequelize.dao';
import UtilFunctions from '../utils/UtilFunctions';
import { HttpStatus, ResponseMessages } from '../types/enums';

dotenv.config();

export class SpaceController extends Singleton {
    private readonly dao: SpaceSequelizeDao = spaceSequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public createSpace = UtilFunctions.catchAsync(async (req, res, next) => {
        const space = await this.dao.createSpace(req.body);

        this.utilFunctions.sendResponse(res)(HttpStatus.CREATED, ResponseMessages.SPACE_CREATED, space);
    });

    public getSpaceById = UtilFunctions.catchAsync(async (req, res, next) => {
        const space = await this.dao.findById(req.params.id);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, space);
    });

    // TODO pagination, limitation, sorting продумать логику как это будет работать
    public getSpacesByQuery = UtilFunctions.catchAsync(async (req, res, next) => {
        const spaces = await this.dao.getSpacesByQuery(req.query);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, spaces);
    });

    public editSpaceById = UtilFunctions.catchAsync(async (req, res, next) => {
        // const space = await this.dao.editSpaceById(req.params.id, req.body);
        const space = await this.dao.editSpaceById(req.params.spaceId, req.user.id, req.body);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK);
    });

    public deleteSpaceById = UtilFunctions.catchAsync(async (req, res, next) => {});

    // NOTE для удаления лишних изображений можно создать кронджоб который будет проходиться
    // по всем спейсам в базе данных и проверять - если к примеру avatarUrl === samvel_5,
    // а в папке изображений есть и нынешний samvel_5, и предыдущий samvel_4,
    // то тот удаляет samvel_4. Говоря иначе, заходим в папку. Берем фото. Проходим по
    // всем записям в бд, если samvel_4 нет нигде, то удаляем.

    // NOTE другой вариант это делать все "на месте" - обновил фотки - сразу обновил и
    // uploads (т.е. при удалении мы формируем массив of filenames of removed files, передаем
    // с фронта на бэк, на эндпоинт removeOutdatedImagesFromUploads). В таком случае
    // возможно будет уместнее создать контроллер изображений.
}

// NOTE export keeping the same style - if we export const then we need to export const everywhere. If default - then default everywhere.
export const spaceController = SingletonFactory.produce<SpaceController>(SpaceController);
