import * as path from 'path';
import * as multer from 'multer';
import * as uuid from 'uuid';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

export enum RequestSerializedObjects {
    USER = 'user',
    SPACE = 'space',
}
export enum StorageEntityReferences {
    USER_ID = 'userId',
    SPACE_ID = 'spaceId',
}
export enum StorageUploadFilenames {
    USER_AVATAR = 'userAvatar',
    SPACE_IMAGES = 'spaceImages',
}

// FIXME probably this is to delete
export enum RequestBodyImageFilename {
    SPACE_IMAGE_TO_REMOVE = 'spaceImageToRemove',
    USER_AVATAR_TO_REMOVE = 'userAvatarToRemove',
}
export enum ReqLocalsImageAmountEntity {
    SPACE_IMAGES_AMOUNT_LEFT = 'spaceImagesAmountLeft',
}

export class StorageConfig extends Singleton {
    private readonly multer = multer;
    private readonly UtilFunctions = UtilFunctions;
    public readonly userAvatarRelativeDir = 'assets/images/users';
    public readonly spaceImagesRelativeDir = 'assets/images/spaces';
    public readonly spaceImagesTotalAmount = 10;

    private readonly diskStorageFactory = (
        requestSerializedObject: RequestSerializedObjects,
        entityDirPath: string
    ): multer.StorageEngine => {
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

    private readonly userAvatarStorage: multer.StorageEngine = this.diskStorageFactory(
        RequestSerializedObjects.USER,
        this.userAvatarRelativeDir
    );

    private readonly spaceImageStorage: multer.StorageEngine = this.diskStorageFactory(
        RequestSerializedObjects.SPACE,
        this.spaceImagesRelativeDir
    );

    public readonly userAvatarUpload = multer({ storage: this.userAvatarStorage });
    public readonly spaceImageUpload = multer({ storage: this.spaceImageStorage });
}

export const storageConfig = SingletonFactory.produce<StorageConfig>(StorageConfig);
export const userAvatarUpload = storageConfig.userAvatarUpload;
export const spaceImageUpload = storageConfig.spaceImageUpload;
export const userAvatarRelativePath = storageConfig.userAvatarRelativeDir;
export const spaceImagesRelativeDir = storageConfig.spaceImagesRelativeDir;
export const spaceImagesTotalAmount = storageConfig.spaceImagesTotalAmount;
