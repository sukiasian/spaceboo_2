import * as dotenv from 'dotenv';
import * as path from 'path';
import * as multer from 'multer';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { UserSequelizeDao } from '../daos/user.sequelize.dao';
import AppError from '../utils/AppError';
import { ErrorMessages, HttpStatus } from '../types/enums';
import {
    spaceImagesRelativeDir,
    StorageEntityReference,
    userAvatarRelativePath,
} from '../configurations/storage.config';
import { SpaceSequelizeDao } from '../daos/space.sequelize.dao';
import { Dao } from '../configurations/dao.config';
import { Model } from 'sequelize/types';
import e = require('express');

dotenv.config();

export class ImageController extends Singleton {
    private readonly userDao: UserSequelizeDao;
    private readonly spaceDao: SpaceSequelizeDao;
    private readonly userAvatarRelativePath = userAvatarRelativePath;
    private readonly spaceImagesRelativePath = spaceImagesRelativeDir;
    private readonly UtilFunctions = UtilFunctions;

    public multerUploadHandler = (uploader) => {
        return (req, res, next) => {
            uploader(req, res, (err) => {
                if (err instanceof multer.MulterError) {
                    next(new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.MULTER_ERROR));
                } else {
                    next(err);
                }
            });
        };
    };

    private getImageFunctionFactory = async (
        req,
        res,
        storageEntityReference: StorageEntityReference,
        dirPath: string,
        dao: Dao,
        entityNotFoundErrorMessage: ErrorMessages
    ): Promise<void> => {
        const id = req.query[storageEntityReference];
        const { fileName } = req.body;
        const entity: Model = await dao.findById(id);

        if (!entity) {
            throw new AppError(HttpStatus.NOT_FOUND, entityNotFoundErrorMessage);
        }

        const pathToImage = path.resolve(dirPath, id, fileName);
        const checkIfImageExists = await this.UtilFunctions.checkIfExists(pathToImage);

        if (!checkIfImageExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.NO_IMAGE_FOUND);
        }

        res.sendFile(pathToImage);
    };

    public getSpacesImageByFileName = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        // NOTE await
        this.getImageFunctionFactory(
            req,
            res,
            StorageEntityReference.SPACE_ID,
            this.spaceImagesRelativePath,
            this.spaceDao,
            ErrorMessages.SPACE_IS_NOT_FOUND
        );
    });

    // public getSpacesImageByFileName = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
    //     const { spaceId } = req.query;
    //     const { fileName } = req.body;

    //     // NOTE because if space is removed and images are not, other people might still be able to access it
    //     const space: Space = await this.spaceDao.findById(spaceId);

    //     if (!space) {
    //         throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.SPACE_IS_NOT_FOUND);
    //     }

    //     const pathToSpaceImage = path.resolve(this.spaceImagesRelativePath, spaceId, fileName);
    //     const checkIfSpaceImageExists = await this.UtilFunctions.checkIfExists(pathToSpaceImage);

    //     if (!checkIfSpaceImageExists) {
    //         throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.NO_IMAGE_FOUND);
    //     }

    //     res.sendFile(pathToSpaceImage);
    // });

    // NOTE
    // public uploadUserAvatar = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
    //     next();
    // });

    public removeUserAvatar = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {});
    public getUserAvatarByFileName = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        // NOTE await
        this.getImageFunctionFactory(
            req,
            res,
            StorageEntityReference.USER_ID,
            this.userAvatarRelativePath,
            this.userDao,
            ErrorMessages.USER_NOT_FOUND
        );
    });

    // NOTE недоступно пользователю и выполняетс яавтоматически
    public destroyOutdatedUserAvatar = this.UtilFunctions.catchAsync(async (req, res, next) => {
        const { userAvatarToRemove } = req.body;
        const { id: userId } = req.user;

        await this.findAndRemoveImage(userId, userAvatarToRemove, this.userAvatarRelativePath);
    });

    public destroyOutdatedSpaceImage = this.UtilFunctions.catchAsync(async (req, res, next) => {
        const { spaceImageToRemove } = req.body;
        const { id: spaceId } = req.space;

        await this.findAndRemoveImage(spaceId, spaceImageToRemove, this.spaceImagesRelativePath);
    });

    // NOTE admin access only
    public destroyAllUserImages = this.UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const pathToUserImagesDir = path.resolve(userAvatarRelativePath, req.user.id);
        const checkIfUserImagesDirExists = await this.UtilFunctions.checkIfExists(pathToUserImagesDir);

        if (!checkIfUserImagesDirExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_IS_NOT_FOUND);
        }

        await this.UtilFunctions.removeDirectory(pathToUserImagesDir, { recursive: true });
    });

    private findAndRemoveImage = async (
        id: string,
        imageToRemoveFilename: string,
        entityDirPath: string
    ): Promise<void> => {
        if (!imageToRemoveFilename || imageToRemoveFilename.length === 0) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.NO_IMAGE_FOUND);
        }

        const pathToEntityIndividualDir = path.resolve(entityDirPath, id);
        const pathToImage = path.resolve(entityDirPath, id, imageToRemoveFilename);
        const checkIfEntityIndividualDirExists = await this.UtilFunctions.checkIfExists(pathToEntityIndividualDir);
        const checkIfFileExists = await this.UtilFunctions.checkIfExists(pathToImage);

        if (!checkIfEntityIndividualDirExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_IS_NOT_FOUND);
        } else if (!checkIfFileExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_IS_NOT_FOUND);
        }

        await this.UtilFunctions.removeFile(pathToImage);
    };
}

export const imageController = SingletonFactory.produce<ImageController>(ImageController);
