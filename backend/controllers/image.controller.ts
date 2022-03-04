import * as dotenv from 'dotenv';
import * as path from 'path';
import * as multer from 'multer';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { userSequelizeDao, UserSequelizeDao } from '../daos/user.sequelize.dao';
import AppError from '../utils/AppError';
import { ErrorMessages, HttpStatus, ResponseMessages } from '../types/enums';
import { StorageUploadFilenames, spaceImagesTotalAmount, imageUpload } from '../configurations/storage.config';
import { spaceSequelizeDao, SpaceSequelizeDao } from '../daos/space.sequelize.dao';
import { Space } from '../models/space.model';

dotenv.config();

export class ImageController extends Singleton {
    private readonly userDao: UserSequelizeDao = userSequelizeDao;
    private readonly spaceDao: SpaceSequelizeDao = spaceSequelizeDao;
    private readonly imageUpload = imageUpload;
    private readonly spaceImagesTotalAmount = spaceImagesTotalAmount;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    private errorIsMulterUnexpectedFile = (err): boolean => {
        return err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE';
    };

    private multerGeneralErrorHandler = (req, res, next): ((err) => void) => {
        return (err) => {
            if (this.errorIsMulterUnexpectedFile(err)) {
                next(new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.SPACE_IMAGES_AMOUNT_EXCEEDED));
            } else if (err! instanceof multer.MulterError) {
                next(err);
            }

            next();
        };
    };

    public uploadUserAvatarToStorage = (req, res, next): void => {
        this.imageUpload.single(StorageUploadFilenames.USER_AVATAR)(
            req,
            res,
            this.multerGeneralErrorHandler(req, res, next)
        );
    };

    public updateUserAvatarInDb = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const userAvatarRelativeUrl = `${req.user.id}/${req.file.filename}`;

        await this.userDao.updateUserAvatarInDb(req.user.id, userAvatarRelativeUrl);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.USER_IMAGE_UPDATED);
    });

    public removeUserAvatarFromStorage = this.utilFunctions.catchAsync(async (req, res, next) => {
        // NOTE: если работают кроны то оптимальнее просто удалять из базы данных вместо того чтобы удалять сначала в сторидже а затем в бд
        const { id: userId } = req.user;
        const user = await this.userDao.findById(userId);
        const { avatarUrl } = user;

        if (!avatarUrl) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.NO_IMAGES_FOUND);
        }

        await this.utilFunctions.findAndRemoveImage(userId, avatarUrl);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.IMAGE_DELETED);

        next();
    });

    public removeUserAvatarFromDb = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;

        await this.userDao.removeUserAvatarFromDb(userId);
    });

    public checkSpaceImagesAvailableAmount = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: spaceId } = req.space;
        const space: Space = await this.spaceDao.findById(spaceId);
        // NOTE: since we cannot access req.body before middleware we have to append numberOfImagesToDelete to req.headers
        const amountOfImagesToDelete = req.headers.amountOfImagesToDelete || 0;
        let spaceImagesAmountLeft = this.spaceImagesTotalAmount;

        if (space.imagesUrl) {
            spaceImagesAmountLeft = this.spaceImagesTotalAmount - space.imagesUrl.length + amountOfImagesToDelete;
        }

        if (spaceImagesAmountLeft === 0) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.SPACE_IMAGES_AMOUNT_EXCEEDED);
        }

        res.locals.spaceImagesAmountLeft = spaceImagesAmountLeft;

        next();
    });

    public uploadSpaceImagesToStorage = this.utilFunctions.catchAsync(async (req, res, next) => {
        const spaceImagesAvaiblableAmount = res.locals.spaceImagesAmountLeft || this.spaceImagesTotalAmount;

        this.imageUpload.array(StorageUploadFilenames.SPACE_IMAGES, spaceImagesAvaiblableAmount)(
            req,
            res,
            this.multerGeneralErrorHandler(req, res, next)
        );
    });

    public updateSpaceImagesInDb = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const uploadedFiles = req.files as Express.Multer.File[];

        if (uploadedFiles) {
            const { id: userId } = req.user;
            const spaceImagesToRemove = req.body.spaceImagesToRemove || [];
            const { spaceId } = res.locals;

            await this.spaceDao.updateSpaceImagesInDb(userId, spaceId, spaceImagesToRemove, uploadedFiles);
        }
    });

    public removeSpaceImagesFromStorage = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: userId } = req.user;
        const { spaceImagesToRemove } = req.body;

        await Promise.all(
            spaceImagesToRemove.map(async (spaceImage: string) => {
                await this.utilFunctions.findAndRemoveImage(userId, spaceImage);
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

    public destroyAllUserImages = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const pathToUserImagesDir = path.resolve('assets/images', req.user.id);
        const checkIfUserImagesDirExists = await this.utilFunctions.checkIfExists(pathToUserImagesDir);

        if (!checkIfUserImagesDirExists) {
            throw new AppError(HttpStatus.NOT_FOUND, ErrorMessages.DIR_NOT_FOUND);
        }

        await this.utilFunctions.removeDirectory(pathToUserImagesDir, { recursive: true });

        this.utilFunctions.sendResponse(res)(HttpStatus.OK);
    });
}

export const imageController = SingletonFactory.produce<ImageController>(ImageController);
