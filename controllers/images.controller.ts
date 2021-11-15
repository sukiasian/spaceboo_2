import * as dotenv from 'dotenv';
import * as path from 'path';
import * as express from 'express';
import * as fs from 'fs';
import { promisify } from 'util';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { ErrorMessages, HttpStatus, LoggerLevels, ResponseMessages } from '../types/enums';
import UtilFunctions from '../utils/UtilFunctions';
import AppError from '../utils/AppError';
import logger from '../loggers/logger';
import { userSequelizeDao } from '../daos/user.sequelize.dao';
import { spaceSequelizeDao } from '../daos/space.sequelize.dao';

dotenv.config();

export class ImagesController extends Singleton {
    private readonly initialRelativeImagesDirname = '';
    private readonly readDirectory = promisify(fs.readdir);
    private readonly removeFile = promisify(fs.rm);
    private readonly userDao = userSequelizeDao;
    private readonly spaceDao = spaceSequelizeDao;

    public getSpacesImages = () => {};

    public getUserAvatar = () => {};

    // NOTE for internal use only
    public destroyOutdatedImages = UtilFunctions.catchAsync(async (req, res, next) => {
        const { imagesToRemove } = req.body;
        const user = await this.userDao.findById(req.user.id, false);
        const spaces = user.spaces;
        let spacesImagesUrl: string[];
        await Promise.all(
            spaces.map((spaceId) => {
                const space = await this.spaceDao.findById(spaceId);

                if (space) {
                    spacesImagesUrl = [...space.imagesUrl];
                } else {
                    // throw new AppError() ??????????????????????????
                }
            })
        );

        // выписать все существующие imagesUrl спейсов юзера
        // всю эту движуху нужно проводить в цикле а не здесь

        // const { imagesUrl } =
        // const { avatarUrl } = user;
        // const allUserImages = [...imagesUrl, avatarUrl]
        // allUserImages
        Promise.all(
            imagesToRemove.map(async (imageToRemove) => {
                // if(allUserImages.includes(imageToRemove)) {
                await this.findFileAndRemoveRecursively(this.initialRelativeImagesDirname, imageToRemove, req.user.id);
                // }
                // else {
                //     throw new AppError(HttpStatus.FORBIDDEN, 'Недостаточно прав для этого действия.');
                // }
            })
        );
        // NOTE можно записывать абсолютный path в бд, и тогда ничего не нужно будет делать. но это не очень правильный подход
    });

    private async findAndRemoveRecursionFunction(
        initialDir: string,
        fileName: string,
        userId: string,
        currentLevel: string[] = []
    ): Promise<boolean> {
        // как проверить на то что пользователь имеет право удалять что то?
        // Исп. jwt strategy.

        // 1. найти пользователя по айди
        // 2. объединить avatarUrls и spaceUrl (посмотреть, принадлежит ли спейс пользователю)

        const dirLevel = currentLevel.join('/');
        let currentFsObjects: fs.Dirent[] = await this.readDirectory(path.resolve(__dirname, initialDir, dirLevel), {
            withFileTypes: true,
        });

        async function findAndRemoveRecursively() {
            for (const fsObject of currentFsObjects) {
                if (fsObject.name === fileName) {
                    // FIXME add protection and check whether a fs object to delete is a file or directory
                    await this.removeFile(path.resolve(__dirname, initialDir, dirLevel, fsObject.name));

                    return true;
                } else if (fsObject.isDirectory()) {
                    currentLevel.push(fsObject.name);

                    const findAndRemover = await this.findAndRemoveRecursionFunction(
                        initialDir,
                        fileName,
                        userId,
                        currentLevel
                    );

                    if (findAndRemover) {
                        return true;
                    }
                }
            }
        }
        const recursivelyFinder = await findAndRemoveRecursively();

        if (recursivelyFinder) {
            return true;
        } else {
            currentLevel.pop();
        }
    }

    private async findFileAndRemoveRecursively(
        initialDir: string,
        fileName: string,
        userId: string,
        currentLevel: string[] = []
    ) {
        const remover = await this.findAndRemoveRecursionFunction(initialDir, fileName, currentLevel, user);
        if (!remover) {
            throw new Error(ErrorMessages.NO_IMAGE_FOUND_TO_DELETE);
        } else {
            logger.log({
                level: LoggerLevels.INFO,
                message: `Изображение ${fileName} успешно удалено из файловой системы.`,
            });
        }
    }
}

export const imagesController = SingletonFactory.produce<ImagesController>(ImagesController);
