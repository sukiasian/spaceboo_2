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
    private readonly allowedAmountOfSpaceImages = 5;
    private readonly imageUpload = imageUpload;
    private readonly spaceImagesTotalAmount = spaceImagesTotalAmount;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    private errorIsMulterUnexpectedFile = (err): boolean => {
        return err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE';
    };

    private multerGeneralErrorHandler = (req, res, next): ((err) => void) => {
        return (err) => {
            if (err instanceof multer.MulterError) {
                next(new AppError(HttpStatus.BAD_REQUEST, err.message));
            } else {
                next(err);
            }

            next();
        };
    };

    private spaceImagesUploadErrorHandler = (req, res, next): ((err) => void) => {
        return (err) => {
            if (this.errorIsMulterUnexpectedFile(err)) {
                next(new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.SPACE_IMAGES_AMOUNT_EXCEEDED));
            } else {
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
        await this.userDao.updateUserAvatarInDb(req.user.id, req.file.filename);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK);
    });

    public removeUserAvatarFromStorage = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;
        const { userAvatarToRemove } = req.body;

        await this.utilFunctions.findAndRemoveImage(userId, userAvatarToRemove);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, ResponseMessages.IMAGE_DELETED);
    });

    public removeUserAvatarFromDb = this.utilFunctions.catchAsync(async (req, res, next) => {
        const { id: userId } = req.user;

        await this.userDao.removeUserAvatarFromDb(userId);

        next();
    });

    public checkSpaceImagesAvailableAmount = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const { id: spaceId } = req.space;
        const space: Space = await this.spaceDao.findById(spaceId);

        let spaceImagesAmountLeft = this.allowedAmountOfSpaceImages;

        if (space.imagesUrl) {
            spaceImagesAmountLeft = this.spaceImagesTotalAmount - space.imagesUrl.length;
        }

        if (spaceImagesAmountLeft === 0) {
            throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.SPACE_IMAGES_AMOUNT_EXCEEDED);
        }

        res.locals.spaceImagesAmountLeft = spaceImagesAmountLeft;

        next();
    });

    public uploadSpaceImagesToStorage = this.utilFunctions.catchAsync(async (req, res, next) => {
        imageUpload.array(StorageUploadFilenames.SPACE_IMAGES, this.allowedAmountOfSpaceImages)(
            req,
            res,
            this.spaceImagesUploadErrorHandler(req, res, next)
        );
    });

    public updateSpaceImagesInDb = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        let attempts = 5;

        const updateSpaceImagesDespiteErrors = async (): Promise<void> => {
            if (attempts > 0) {
                try {
                    const { spaceId } = res.locals;
                    const uploadedFiles = req.files as Express.Multer.File[];
                    const uploadedFilesNames = uploadedFiles.map((file: Express.Multer.File) => {
                        return file.filename;
                    }) as string[];

                    await this.spaceDao.updateSpaceImagesInDb(spaceId, uploadedFilesNames);
                } catch {
                    updateSpaceImagesDespiteErrors();
                }
            }
        };

        while (attempts > 0) {
            updateSpaceImagesDespiteErrors();

            attempts--;

            // TODO if still cant upload to database then delete the space but we need to do it smoothly - letting the user to know about it
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
