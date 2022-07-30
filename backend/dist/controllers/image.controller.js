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
dotenv.config();
class ImageController extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.userDao = user_sequelize_dao_1.userSequelizeDao;
        this.spaceDao = space_sequelize_dao_1.spaceSequelizeDao;
        this.imageUpload = storage_config_1.imageUpload;
        this.spaceImagesTotalAmount = storage_config_1.spaceImagesTotalAmount;
        this.utilFunctions = UtilFunctions_1.default;
        this.errorIsMulterUnexpectedFile = (err) => {
            return err instanceof multer.MulterError && err.code === 'LIMIT_UNEXPECTED_FILE';
        };
        this.multerGeneralErrorHandler = (req, res, next) => {
            return (err) => {
                if (this.errorIsMulterUnexpectedFile(err)) {
                    next(new AppError_1.default(enums_1.HttpStatus.BAD_REQUEST, enums_1.ErrorMessages.SPACE_IMAGES_AMOUNT_EXCEEDED));
                }
                else if (err instanceof multer.MulterError) {
                    next(err);
                }
                next();
            };
        };
        this.uploadUserAvatarToStorage = (req, res, next) => {
            this.imageUpload.single(storage_config_1.StorageUploadFilenames.USER_AVATAR)(req, res, this.multerGeneralErrorHandler(req, res, next));
        };
        this.updateUserAvatarInDb = this.utilFunctions.catchAsync(async (req, res, next) => {
            const userAvatarRelativeUrl = `${req.user.id}/${req.file.filename}`;
            await this.userDao.updateUserAvatarInDb(req.user.id, userAvatarRelativeUrl);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.USER_IMAGE_UPDATED);
        });
        this.removeUserAvatarFromStorage = this.utilFunctions.catchAsync(async (req, res, next) => {
            // NOTE: если работают кроны то оптимальнее просто удалять из базы данных вместо того чтобы удалять сначала в сторидже а затем в бд
            const { id: userId } = req.user;
            const user = await this.userDao.findById(userId);
            const { avatarUrl } = user;
            if (!avatarUrl) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.NO_IMAGES_FOUND);
            }
            await this.utilFunctions.findAndRemoveImage(userId, avatarUrl);
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.IMAGE_DELETED);
            next();
        });
        this.removeUserAvatarFromDb = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            await this.userDao.removeUserAvatarFromDb(userId);
        });
        this.checkSpaceImagesAvailableAmount = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: spaceId } = req.space;
            const space = await this.spaceDao.findById(spaceId);
            // NOTE: since we cannot access req.body before middleware we have to append numberOfImagesToDelete to req.headers
            const amountOfImagesToDelete = req.headers.amountOfImagesToDelete || 0;
            let spaceImagesAmountLeft = this.spaceImagesTotalAmount;
            if (space.imagesUrl) {
                spaceImagesAmountLeft = this.spaceImagesTotalAmount - space.imagesUrl.length + amountOfImagesToDelete;
            }
            if (spaceImagesAmountLeft === 0) {
                throw new AppError_1.default(enums_1.HttpStatus.FORBIDDEN, enums_1.ErrorMessages.SPACE_IMAGES_AMOUNT_EXCEEDED);
            }
            res.locals.spaceImagesAmountLeft = spaceImagesAmountLeft;
            next();
        });
        this.uploadSpaceImagesToStorage = this.utilFunctions.catchAsync(async (req, res, next) => {
            const spaceImagesAvaiblableAmount = res.locals.spaceImagesAmountLeft || this.spaceImagesTotalAmount;
            this.imageUpload.array(storage_config_1.StorageUploadFilenames.SPACE_IMAGES, spaceImagesAvaiblableAmount)(req, res, this.multerGeneralErrorHandler(req, res, next));
        });
        this.updateSpaceImagesInDb = this.utilFunctions.catchAsync(async (req, res, next) => {
            const uploadedFiles = req.files;
            if (uploadedFiles) {
                const { id: userId } = req.user;
                const spaceImagesToRemove = req.body.spaceImagesToRemove || [];
                const { spaceId } = res.locals;
                await this.spaceDao.updateSpaceImagesInDb(userId, spaceId, spaceImagesToRemove, uploadedFiles);
            }
        });
        this.removeSpaceImagesFromStorage = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { id: userId } = req.user;
            const { spaceImagesToRemove } = req.body;
            await Promise.all(spaceImagesToRemove.map(async (spaceImage) => {
                await this.utilFunctions.findAndRemoveImage(userId, spaceImage);
            }));
            this.utilFunctions.sendResponse(res)(enums_1.HttpStatus.OK, enums_1.ResponseMessages.IMAGES_DELETED);
        });
        this.removeSpaceImagesFromDb = this.utilFunctions.catchAsync(async (req, res, next) => {
            const { spaceImagesToRemove } = req.body;
            const { id: spaceId } = req.space;
            await this.spaceDao.removeSpaceImagesFromDb(spaceId, spaceImagesToRemove);
            next();
        });
        this.destroyAllUserImages = this.utilFunctions.catchAsync(async (req, res, next) => {
            const pathToUserImagesDir = path.resolve('assets/images', req.user.id);
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