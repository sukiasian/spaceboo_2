"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageController = exports.ImageController = void 0;
const dotenv = require("dotenv");
const path = require("path");
const multer = require("multer");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
const user_sequelize_dao_1 = require("../daos/user.sequelize.dao");
const AppError_1 = require("../utils/AppError");
const enums_1 = require("../types/enums");
const storage_config_1 = require("../configurations/storage.config");
const space_sequelize_dao_1 = require("../daos/space.sequelize.dao");
const space_model_1 = require("../models/space.model");
dotenv.config();
class ImageController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.userDao = user_sequelize_dao_1.userSequelizeDao;
        this.spaceDao = space_sequelize_dao_1.spaceSequelizeDao;
        this.spaceModel = space_model_1.Space;
        this.spaceImagesUpload = storage_config_1.spaceImagesUpload;
        this.userAvatarUpload = storage_config_1.userAvatarUpload;
        this.userAvatarRelativePath = storage_config_1.userAvatarRelativePath;
        this.spaceImagesRelativePath = storage_config_1.spaceImagesRelativeDir;
        this.spaceImagesTotalAmount = storage_config_1.spaceImagesTotalAmount;
        this.utilFunctions = UtilFunctions_1.default;
        this.multerErrorHandler = (req, res, next) => {
            return (err) => {
                if (err instanceof multer.MulterError) {
                    next(new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, err.message));
                }
                else {
                    next(err);
                }
            };
        };
        this.multerUploadSpaceImagesForProvideErrorHandler = (req, res, next) => {
            return async (err) => {
                const { id } = req.space;
                const space = await this.spaceModel.findOne({
                    where: {
                        id,
                    },
                });
                if (!space) {
                    next(new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, enums_1.ErrorMessages.SPACE_NOT_FOUND));
                }
                await space.destroy();
                if (err instanceof multer.MulterError) {
                    next(new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, err.message));
                }
                else {
                    next(new Error(err));
                }
            };
        };
        this.multerGeneralUploadForArrays = (entity, uploader) => {
            return (req, res, next) => {
                const imagesAmountLeft = res.locals[entity];
                uploader.array(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, imagesAmountLeft)(req, res, this.multerErrorHandler(req, res, next));
            };
        };
        this.multerUploadSpaceImagesForProvideSpace = (entity, uploader) => {
            return (req, res, next) => {
                const imagesAmountLeft = res.locals[entity];
                uploader.array(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, imagesAmountLeft)(req, res, this.multerUploadSpaceImagesForProvideErrorHandler(req, res, next));
            };
        };
        this.uploadUserAvatarToStorage = (req, res, next) => {
            this.userAvatarUpload.single(storage_config_1.StorageUploadFilenames.USER_AVATAR)(req, res, this.multerErrorHandler(req, res, next));
        };
        this.uploadSpaceImageToStorageForProvideSpace = this.multerUploadSpaceImagesForProvideSpace(storage_config_1.ResLocalsImageAmountEntity.SPACE_IMAGES_AMOUNT_LEFT, this.spaceImagesUpload);
        this.uploadSpaceImagesToStorageGeneral = this.multerGeneralUploadForArrays(storage_config_1.ResLocalsImageAmountEntity.SPACE_IMAGES_AMOUNT_LEFT, this.spaceImagesUpload);
        this.getImageFunctionFactory = async (req, res, storageEngityReference, dirPath, dao, entityNotFoundErrorMessage) => {
            const id = req.params[storageEngityReference];
            const { filename } = req.body;
            const entity = await dao.findById(id);
            if (!entity) {
                throw new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, entityNotFoundErrorMessage);
            }
            const pathToImage = path.resolve(dirPath, id, filename);
            const checkIfImageExists = await this.utilFunctions.checkIfExists(pathToImage);
            if (!checkIfImageExists) {
                throw new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, enums_1.ErrorMessages.NO_IMAGE_FOUND);
            }
            res.sendFile(pathToImage);
        };
        this.getSpacesImageByFilename = this.utilFunctions.catchAsync(async (req, res, next) => {
            this.getImageFunctionFactory(req, res, storage_config_1.StorageEntityReferences.SPACE_ID, this.spaceImagesRelativePath, this.spaceDao, enums_1.ErrorMessages.SPACE_NOT_FOUND);
        });
        this.getUserAvatarByFilename = this.utilFunctions.catchAsync(async (req, res, next) => {
            this.getImageFunctionFactory(req, res, storage_config_1.StorageEntityReferences.USER_ID, this.userAvatarRelativePath, this.userDao, enums_1.ErrorMessages.USER_NOT_FOUND);
        });
        this.removeUserAvatarFromStorage = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            const { userAvatarToRemove } = req.body;
            await this.utilFunctions.findAndRemoveImage(userId, userAvatarToRemove, this.userAvatarRelativePath);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.IMAGE_DELETED);
        });
        this.removeUserAvatarFromDb = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            await this.userDao.removeUserAvatarFromDb(userId);
            next();
        });
        this.updateUserAvatarInDb = this.utilFunctions.catchAsync(async (req, res, next) => {
            await this.userDao.updateUserAvatarInDb(req.user.id, req.file.filename);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK);
        });
        this.checkSpaceImagesAmount = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: spaceId } = req.space;
            const space = await this.spaceDao.findById(spaceId);
            let spaceImagesAmountLeft = 10;
            if (space.imagesUrl) {
                spaceImagesAmountLeft = this.spaceImagesTotalAmount - space.imagesUrl.length;
            }
            if (spaceImagesAmountLeft === 0) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.SPACE_IMAGES_AMOUNT_EXCEEDED);
            }
            res.locals.spaceImagesAmountLeft = spaceImagesAmountLeft;
            next();
        });
        this.removeSpaceImagesFromStorage = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: spaceId } = req.space;
            const { spaceImagesToRemove } = req.body;
            await Promise.all(spaceImagesToRemove.map(async (spaceImage) => {
                await this.utilFunctions.findAndRemoveImage(spaceId, spaceImage, this.spaceImagesRelativePath);
            }));
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.IMAGES_DELETED);
        });
        this.removeSpaceImagesFromDb = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { spaceImagesToRemove } = req.body;
            const { id: spaceId } = req.space;
            await this.spaceDao.removeSpaceImagesFromDb(spaceId, spaceImagesToRemove);
            next();
        });
        this.updateSpaceImagesInDb = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: spaceId } = req.space;
            const uploadedFiles = req.files;
            const uploadedFilesNames = uploadedFiles.map((file) => {
                return file.filename;
            });
            await this.spaceDao.updateSpaceImagesInDb(spaceId, uploadedFilesNames);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK);
        });
        this.destroyAllUserImages = this.utilFunctions.catchAsync(async (req, res, next) => {
            const pathToUserImagesDir = path.resolve(storage_config_1.userAvatarRelativePath, req.user.id);
            const checkIfUserImagesDirExists = await this.utilFunctions.checkIfExists(pathToUserImagesDir);
            if (!checkIfUserImagesDirExists) {
                throw new AppError_1.default(enums_1.HttpStatus.NOT_FOUND, enums_1.ErrorMessages.DIR_NOT_FOUND);
            }
            await this.utilFunctions.removeDirectory(pathToUserImagesDir, { recursive: true });
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK);
        });
    }
}
exports.ImageController = ImageController;
exports.imageController = Singleton_1.SingletonFactory.produce(ImageController);
//# sourceMappingURL=image.controller.js.map