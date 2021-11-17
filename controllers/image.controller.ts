import * as dotenv from 'dotenv';
import * as path from 'path';
import * as express from 'express';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { UserSequelizeDao } from '../daos/user.sequelize.dao';
import AppError from '../utils/AppError';
import { ErrorMessages, HttpStatus } from '../types/enums';
import { User } from '../models/user.model';
import { userImagesRelativePath } from '../configurations/storage.config';
import { SpaceSequelizeDao } from '../daos/space.sequelize.dao';
import { Space } from '../models/space.model';

dotenv.config();

export class ImageController extends Singleton {
    private readonly userDao: UserSequelizeDao;
    private readonly spaceDao: SpaceSequelizeDao;
    private readonly userImagesRelativePath = userImagesRelativePath;
    private readonly UtilFunctions = UtilFunctions;

    public getSpacesImages = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { spaceId } = req.query;
        const space: Space = await this.spaceDao.findById(spaceId);

        res.sendFile('');
    });

    public uploadUserAvatar = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        res.status(200).json('hi');
    });

    public getUserAvatar = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { userId, fileName } = req.body;
        const user: User = await this.userDao.findById(userId);

        if (!user) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.USER_NOT_FOUND);
        }

        const pathToUserAvatar = path.resolve(this.userImagesRelativePath, userId, user.avatarUrl);
        const checkIfAvatarExists = await this.UtilFunctions.checkIfExists(pathToUserAvatar);

        if (!checkIfAvatarExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.NO_IMAGE_FOUND);
        }

        res.sendFile(pathToUserAvatar);
    });

    // NOTE for internal use only
    public destroyOutdatedImages = this.UtilFunctions.catchAsync(async (req, res, next) => {
        const { imagesToRemove } = req.files;
        const userId = req.user.id;

        await this.findAndRemoveUserImages(userId, imagesToRemove);
    });

    // NOTE admin access only
    public destroyAllUserImages = this.UtilFunctions.catchAsync(async (req, res, next) => {
        const pathToUserImagesDir = path.resolve(userImagesRelativePath, req.user.id);
        const checkIfUserImagesDirExists = await this.UtilFunctions.checkIfExists(pathToUserImagesDir);

        if (!checkIfUserImagesDirExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_IS_NOT_FOUND);
        }

        await this.UtilFunctions.removeDirectory(pathToUserImagesDir, { recursive: true });
    });

    private findAndRemoveUserImages = async (userId: string, imagesToRemove: string[]) => {
        if (imagesToRemove.length === 0) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.NO_IMAGE_FOUND);
        }

        const pathToUserImagesDir = path.resolve(`uploads/images/users/${userId}`);
        const userImages = await this.UtilFunctions.readDirectory(pathToUserImagesDir);

        if (!userImages) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_IS_NOT_FOUND);
        }

        for (const imageToRemove of imagesToRemove) {
            await UtilFunctions.removeFile(pathToUserImagesDir);
        }
    };
}

export const imageController = SingletonFactory.produce<ImageController>(ImageController);
