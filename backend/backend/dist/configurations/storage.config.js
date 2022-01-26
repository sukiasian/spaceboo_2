"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spaceImagesTotalAmount = exports.spaceImagesRelativeDir = exports.userAvatarRelativePath = exports.multerFormDataParser = exports.spaceImagesUpload = exports.userAvatarUpload = exports.storageConfig = exports.StorageConfig = exports.ResLocalsImageAmountEntity = exports.RequestBodyImageFilename = exports.StorageUploadFilenames = exports.StorageEntityReferences = exports.RequestSerializedObjects = void 0;
const path = require("path");
const multer = require("multer");
const uuid = require("uuid");
const Singleton_1 = require("../utils/Singleton");
const UtilFunctions_1 = require("../utils/UtilFunctions");
var RequestSerializedObjects;
(function (RequestSerializedObjects) {
    RequestSerializedObjects["USER"] = "user";
    RequestSerializedObjects["SPACE"] = "space";
})(RequestSerializedObjects = exports.RequestSerializedObjects || (exports.RequestSerializedObjects = {}));
var StorageEntityReferences;
(function (StorageEntityReferences) {
    StorageEntityReferences["USER_ID"] = "userId";
    StorageEntityReferences["SPACE_ID"] = "spaceId";
})(StorageEntityReferences = exports.StorageEntityReferences || (exports.StorageEntityReferences = {}));
var StorageUploadFilenames;
(function (StorageUploadFilenames) {
    StorageUploadFilenames["USER_AVATAR"] = "userAvatar";
    StorageUploadFilenames["SPACE_IMAGES"] = "spaceImages";
})(StorageUploadFilenames = exports.StorageUploadFilenames || (exports.StorageUploadFilenames = {}));
// FIXME probably this is to delete
var RequestBodyImageFilename;
(function (RequestBodyImageFilename) {
    RequestBodyImageFilename["SPACE_IMAGE_TO_REMOVE"] = "spaceImageToRemove";
    RequestBodyImageFilename["USER_AVATAR_TO_REMOVE"] = "userAvatarToRemove";
})(RequestBodyImageFilename = exports.RequestBodyImageFilename || (exports.RequestBodyImageFilename = {}));
var ResLocalsImageAmountEntity;
(function (ResLocalsImageAmountEntity) {
    ResLocalsImageAmountEntity["SPACE_IMAGES_AMOUNT_LEFT"] = "spaceImagesAmountLeft";
})(ResLocalsImageAmountEntity = exports.ResLocalsImageAmountEntity || (exports.ResLocalsImageAmountEntity = {}));
class StorageConfig extends Singleton_1.Singleton {
    constructor() {
        super(...arguments);
        this.multer = multer;
        this.UtilFunctions = UtilFunctions_1.default;
        this.userAvatarRelativeDir = 'assets/images/users';
        this.spaceImagesRelativeDir = 'assets/images/spaces';
        this.spaceImagesTotalAmount = 10;
        this.diskStorageFactory = (requestSerializedObject, entityDirPath) => {
            return this.multer.diskStorage({
                destination: async (req, file, cb) => {
                    const { id } = req[requestSerializedObject];
                    const individualDirPathForEntity = path.resolve(entityDirPath, id);
                    const dirExists = await this.UtilFunctions.checkIfExists(individualDirPathForEntity);
                    if (!dirExists) {
                        await this.UtilFunctions.makeDirectory(individualDirPathForEntity);
                    }
                    cb(null, individualDirPathForEntity);
                },
                filename: (req, file, cb) => {
                    const idx = file.mimetype.indexOf('/');
                    const extension = file.mimetype.substr(idx + 1, file.mimetype.length - idx);
                    cb(null, uuid.v4() + `.${extension}`);
                },
            });
        };
        this.userAvatarStorage = this.diskStorageFactory(RequestSerializedObjects.USER, this.userAvatarRelativeDir);
        this.spaceImageStorage = this.diskStorageFactory(RequestSerializedObjects.SPACE, this.spaceImagesRelativeDir);
        this.userAvatarUpload = multer({ storage: this.userAvatarStorage });
        this.spaceImagesUpload = multer({ storage: this.spaceImageStorage });
        this.multerFormDataParser = multer();
    }
}
exports.StorageConfig = StorageConfig;
exports.storageConfig = Singleton_1.SingletonFactory.produce(StorageConfig);
exports.userAvatarUpload = exports.storageConfig.userAvatarUpload;
exports.spaceImagesUpload = exports.storageConfig.spaceImagesUpload;
exports.multerFormDataParser = exports.storageConfig.multerFormDataParser;
exports.userAvatarRelativePath = exports.storageConfig.userAvatarRelativeDir;
exports.spaceImagesRelativeDir = exports.storageConfig.spaceImagesRelativeDir;
exports.spaceImagesTotalAmount = exports.storageConfig.spaceImagesTotalAmount;
//# sourceMappingURL=storage.config.js.map