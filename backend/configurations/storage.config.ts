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

export enum RequestBodyImageFilename {
    SPACE_IMAGE_TO_REMOVE = 'spaceImageToRemove',
    USER_AVATAR_TO_REMOVE = 'userAvatarToRemove',
}
export enum ResLocalsImageAmountEntity {
    SPACE_IMAGES_AMOUNT_LEFT = 'spaceImagesAmountLeft',
}

export class StorageConfig extends Singleton {
    private readonly multer = multer;
    private readonly UtilFunctions = UtilFunctions;
    public readonly spaceImagesTotalAmount = 5;

    private readonly diskStorageFactory = (): multer.StorageEngine => {
        return this.multer.diskStorage({
            destination: async (req: any, file, cb) => {
                const { id: userId } = req.user;
                const individualDirPathForUser = path.resolve('assets/images', userId);
                const dirExists = await this.UtilFunctions.checkIfExists(individualDirPathForUser);

                if (!dirExists) {
                    await this.UtilFunctions.makeDirectory(individualDirPathForUser);
                }

                cb(null, individualDirPathForUser);
            },
            filename: (req, file, cb) => {
                const idx = file.mimetype.indexOf('/');
                const extension = file.mimetype.substr(idx + 1, file.mimetype.length - idx);

                cb(null, `${uuid.v4()}.${extension}`);
            },
        });
    };

    public readonly imageUpload = multer({ storage: this.diskStorageFactory() });
}

export const storageConfig = SingletonFactory.produce<StorageConfig>(StorageConfig);
export const imageUpload = storageConfig.imageUpload;
export const spaceImagesTotalAmount = storageConfig.spaceImagesTotalAmount;
