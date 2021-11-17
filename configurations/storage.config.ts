import * as path from 'path';
import * as multer from 'multer';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

export class StorageConfig extends Singleton {
    public readonly userImagesRelativePath = 'assets/images/users';
    private readonly userImagesStorage: multer.StorageEngine = multer.diskStorage({
        destination: async (req, file, cb) => {
            // NOTE либо req.body.destination, либо req.user.id
            const userId = (req.user as { id: string }).id;
            const directoryExists = await UtilFunctions.checkIfExists(
                path.resolve(this.userImagesRelativePath, userId)
            );

            if (!directoryExists) {
                await UtilFunctions.makeDirectory(path.resolve(this.userImagesRelativePath, userId));
            }
            // NOTE было .join(__dirname, ...)
            cb(null, path.resolve(this.userImagesRelativePath, userId));
        },
        filename: (req, file, cb) => {
            const idx = file.mimetype.indexOf('/');
            const extension = file.mimetype.substr(idx + 1, file.mimetype.length - idx);

            cb(null, Date.now() + `.${extension}`);
        },
    });
    public readonly userImagesUpload: multer.Multer = multer({ storage: this.userImagesStorage });
}

export const storageConfig = SingletonFactory.produce<StorageConfig>(StorageConfig);
export const userImagesUpload = storageConfig.userImagesUpload;
export const userImagesRelativePath = storageConfig.userImagesRelativePath;
