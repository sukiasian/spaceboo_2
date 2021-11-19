import * as path from 'path';
import * as multer from 'multer';
import * as uuid from 'uuid';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

export enum StorageEntityReference {
    USER_ID = 'userId',
    SPACE_ID = 'spaceId',
}

export enum StorageUploadFilenames {
    USER_AVATAR = 'userAvatar',
    SPACE_IMAGE = 'spaceImage',
}
export class StorageConfig extends Singleton {
    private readonly multer = multer;
    private readonly UtilFunctions = UtilFunctions;
    public readonly userAvatarRelativeDir = 'assets/images/users';
    public readonly spaceImagesRelativeDir = 'assets/images/spaces';

    private readonly diskStorageFactory = (
        storageEntityName: StorageEntityReference,
        entityDirPath: string
    ): multer.StorageEngine => {
        return this.multer.diskStorage({
            destination: async (req, file, cb) => {
                const id = req.params[storageEntityName] as string;
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
        StorageEntityReference.USER_ID,
        this.userAvatarRelativeDir
    );

    private readonly spaceImageStorage: multer.StorageEngine = this.diskStorageFactory(
        StorageEntityReference.SPACE_ID,
        this.spaceImagesRelativeDir
    );

    public readonly userAvatarUpload: multer.Multer = multer({ storage: this.userAvatarStorage });
    public readonly spaceImageUpload: multer.Multer = multer({ storage: this.spaceImageStorage });
}

export const storageConfig = SingletonFactory.produce<StorageConfig>(StorageConfig);
export const userAvatarUpload = storageConfig.userAvatarUpload;
export const spaceImageUpload = storageConfig.spaceImageUpload;
export const userAvatarRelativePath = storageConfig.userAvatarRelativeDir;
export const spaceImagesRelativeDir = storageConfig.spaceImagesRelativeDir;
