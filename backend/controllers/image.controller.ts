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
    spaceImageUpload,
    StorageUploadFilenames,
    spaceImagesTotalAmount,
    userAvatarUpload,
    ReqLocalsImageAmountEntity,
} from '../configurations/storage.config';
import { spaceSequelizeDao, SpaceSequelizeDao } from '../daos/space.sequelize.dao';
import { Dao } from '../configurations/dao.config';
import { Model } from 'sequelize/types';
import { Space } from '../models/space.model';

dotenv.config();

export class ImageController extends Singleton {
    private readonly userDao: UserSequelizeDao = userSequelizeDao;
    private readonly spaceDao: SpaceSequelizeDao = spaceSequelizeDao;
    private readonly spaceModel: typeof Space = Space;
    private readonly spaceImageUpload = spaceImageUpload;
    private readonly userAvatarUpload = userAvatarUpload;
    private readonly userAvatarRelativePath = userAvatarRelativePath;
    private readonly spaceImagesRelativePath = spaceImagesRelativeDir;
    private readonly spaceImagesTotalAmount = spaceImagesTotalAmount;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    private multerErrorHandler = (req, res, next): ((err) => void) => {
        return (err) => {
            if (err instanceof multer.MulterError) {
                next(new AppError(HttpStatus.FORBIDDEN, err.message));
            } else {
                next(err);
            }
        };
    };

    private multerUploadSpaceImagesForProvideErrorHandler = (req, res, next): ((err) => void) => {
        return async (err) => {
            const { spaceId } = res.locals;

            const space = await this.spaceModel.findOne({ where: { id: spaceId } });

            if (!space) {
                next(new AppError(HttpStatus.NOT_FOUND, ErrorMessages.SPACE_NOT_FOUND));
            }

            await space.destroy();

            if (err instanceof multer.MulterError) {
                next(new AppError(HttpStatus.FORBIDDEN, 'shit happened'));
            } else {
                next(err);
            }
        };
    };

    private multerGeneralUploadForArrays = (entity: string, uploader: multer.Multer) => {
        return (req, res, next) => {
            const imagesAmountLeft = res.locals[entity];

            uploader.array(StorageUploadFilenames.SPACE_IMAGES, imagesAmountLeft as number)(
                req,
                res,
                this.multerErrorHandler(req, res, next)
            );
        };
    };

    private multerUploadSpaceImagesForProvideSpace = (entity: string, uploader: multer.Multer) => {
        return (req, res, next) => {
            const imagesAmountLeft = res.locals[entity];

            uploader.array(StorageUploadFilenames.SPACE_IMAGES, imagesAmountLeft as number)(
                req,
                res,
                this.multerUploadSpaceImagesForProvideErrorHandler(req, res, next)
            );
        };
    };

    public uploadUserAvatarToStorage = (req, res, next): void => {
        this.userAvatarUpload.single(StorageUploadFilenames.USER_AVATAR)(
            req,
            res,
            this.multerErrorHandler(req, res, next)
        );
    };

    public uploadSpaceImageToStorageForProvideSpace = this.multerUploadSpaceImagesForProvideSpace(
        ReqLocalsImageAmountEntity.SPACE_IMAGES_AMOUNT_LEFT,
        this.spaceImageUpload
    );

    public uploadSpaceImageToStorageGeneral = this.multerGeneralUploadForArrays(
        ReqLocalsImageAmountEntity.SPACE_IMAGES_AMOUNT_LEFT,
        this.spaceImageUpload
    );

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

    public removeUserAvatarFromStorage = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;
        const { userAvatarToRemove } = req.body;

        await this.utilFunctions.findAndRemoveImage(userId, userAvatarToRemove, this.userAvatarRelativePath);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.IMAGE_DELETED);
    });

    public removeUserAvatarFromDb = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;

        await this.userDao.removeUserAvatarFromDb(userId);

        next();
    });

    public updateUserAvatarInDb = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        await this.userDao.updateUserAvatarInDb(req.user.id, req.file.filename);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK);
    });

    public checkSpaceImagesAmount = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: spaceId } = req.space;
        const space: Space = await this.spaceDao.findById(spaceId);
        const spaceImagesAmountLeft = this.spaceImagesTotalAmount - space.imagesUrl.length;

        if (spaceImagesAmountLeft === 0) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.SPACE_IMAGES_AMOUNT_EXCEEDED);
        }

        res.locals.spaceImagesAmountLeft = spaceImagesAmountLeft;

        next();
    });

    public removeSpaceImagesFromStorage = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: spaceId } = req.space;
        const { spaceImagesToRemove } = req.body;

        await Promise.all(
            spaceImagesToRemove.map(async (spaceImage: string) => {
                await this.utilFunctions.findAndRemoveImage(spaceId, spaceImage, this.spaceImagesRelativePath);
            })
        );

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.IMAGES_DELETED);
    });

    public removeSpaceImagesFromDb = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { spaceImagesToRemove } = req.body;
        const { id: spaceId } = req.space;

        await this.spaceDao.removeSpaceImagesFromDb(spaceId, spaceImagesToRemove);

        next();
    });

    public updateSpaceImagesInDb = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: spaceId } = req.space;
        const uploadedFiles = req.files as Express.Multer.File[];
        const uploadedFilesNames = uploadedFiles.map((file: Express.Multer.File) => {
            return file.filename;
        }) as string[];

        await this.spaceDao.updateSpaceImagesInDb(spaceId, uploadedFilesNames);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK);
    });

    public destroyAllUserImages = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const pathToUserImagesDir = path.resolve(userAvatarRelativePath, req.user.id);
        const checkIfUserImagesDirExists = await this.utilFunctions.checkIfExists(pathToUserImagesDir);

        if (!checkIfUserImagesDirExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_NOT_FOUND);
        }

        await this.utilFunctions.removeDirectory(pathToUserImagesDir, { recursive: true });

        this.utilFunctions.sendResponse(res)(HttpStatus.OK);
    });
}

export const imageController = SingletonFactory.produce<ImageController>(ImageController);
