import * as dotenv from 'dotenv';
import * as path from 'path';
import * as multer from 'multer';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import AppError from '../utils/AppError';
import { ErrorMessages, HttpStatus, ResponseMessages } from '../types/enums';
import {
    spaceImagesRelativeDir,
    userAvatarRelativePath,
    StorageEntityReferences,
} from '../configurations/storage.config';
import { spaceSequelizeDao, SpaceSequelizeDao } from '../daos/space.sequelize.dao';
import { Dao } from '../configurations/dao.config';
import { Model } from 'sequelize/types';

dotenv.config();

export class ImageController extends Singleton {
    private readonly userDao: UserSequelizeDao = userSequelizeDao;
    private readonly spaceDao: SpaceSequelizeDao = spaceSequelizeDao;
    private readonly userAvatarRelativePath = userAvatarRelativePath;
    private readonly spaceImagesRelativePath = spaceImagesRelativeDir;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

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
        storageEngityReference: StorageEntityReferences,
        dirPath: string,
        dao: Dao,
        entityNotFoundErrorMessage: ErrorMessages
    ): Promise<void> => {
        const id = req.params[storageEngityReference];
        const { filename } = req.body;
        const entity: Model = await dao.findById(id);

        if (!entity) {
            throw new AppError(HttpStatus.NOT_FOUND, entityNotFoundErrorMessage);
        }

        const pathToImage = path.resolve(dirPath, id, filename);
        const checkIfImageExists = await this.utilFunctions.checkIfExists(pathToImage);

        if (!checkIfImageExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.NO_IMAGE_FOUND);
        }

        res.sendFile(pathToImage);
    };

    public getSpacesImageByFilename = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        this.getImageFunctionFactory(
            req,
            res,
            StorageEntityReferences.SPACE_ID,
            this.spaceImagesRelativePath,
            this.spaceDao,
            ErrorMessages.SPACE_NOT_FOUND
        );
    });

    public getUserAvatarByFilename = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        this.getImageFunctionFactory(
            req,
            res,
            StorageEntityReferences.USER_ID,
            this.userAvatarRelativePath,
            this.userDao,
            ErrorMessages.USER_NOT_FOUND
        );
    });

    public destroyOutdatedUserAvatar = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { userAvatarToRemove } = req.body;
        const { id: userId } = req.user;

        await this.findAndRemoveImage(userId, userAvatarToRemove, this.userAvatarRelativePath);
        await this.userDao.cleanUserAvatarData(userId);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.IMAGE_DELETED);
    });

    public destroyOutdatedSpaceImage = this.utilFunctions.catchAsync(async (req, res, next) => {
        /* 
        
        Касаемо регистрации: чтобы пространство было добавлено в листинг нужно будет загрузить фото. Для этого нужно 
        видимо нужно будет поменять логику и роуты:

        - POST: uploadSpaceImages, где загружаются фото и сразу попадает в листинг 
        - PUT: updateSpaceImages
        - DELETE: findAndRemove - где если последнее фото удаляется,то спейс снимается с листинга 
        -- и менять всю логику ))) 

        */

        const { spaceImageToRemove } = req.body;
        const { id: spaceId } = req.space;

        await this.findAndRemoveImage(spaceId, spaceImageToRemove, this.spaceImagesRelativePath);
        await this.spaceDao.cleanSpaceImageData(spaceId, spaceImageToRemove);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.IMAGE_DELETED);
    });

    // NOTE admin access only
    public destroyAllUserImages = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const pathToUserImagesDir = path.resolve(userAvatarRelativePath, req.user.id);
        const checkIfUserImagesDirExists = await this.utilFunctions.checkIfExists(pathToUserImagesDir);

        if (!checkIfUserImagesDirExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_NOT_FOUND);
        }

        await this.utilFunctions.removeDirectory(pathToUserImagesDir, { recursive: true });
    });

    private findAndRemoveImage = async (
        id: string,
        imageToRemoveFilename: string,
        entityDirPath: string
    ): Promise<void> => {
        if (!imageToRemoveFilename || imageToRemoveFilename.length === 0) {
            // FIXME возможно нужно выкинуть ошибку "Нет изображений для поиска"
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.NO_IMAGE_FOUND);
        }

        const pathToEntityIndividualDir = path.resolve(entityDirPath, id);
        const pathToImage = path.resolve(entityDirPath, id, imageToRemoveFilename);
        const checkIfEntityIndividualDirExists = await this.utilFunctions.checkIfExists(pathToEntityIndividualDir);
        const checkIfFileExists = await this.utilFunctions.checkIfExists(pathToImage);

        if (!checkIfEntityIndividualDirExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_NOT_FOUND);
        } else if (!checkIfFileExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_NOT_FOUND);
        }

        await this.utilFunctions.removeFile(pathToImage);
    };
}

export const imageController = SingletonFactory.produce<ImageController>(ImageController);
