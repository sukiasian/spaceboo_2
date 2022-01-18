import * as express from 'express';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';
import * as path from 'path';
import { Sequelize } from 'sequelize-typescript';
import { Application } from '../App';
import { IUserCreate } from '../models/user.model';
import connectToDb from '../database/connectToDb';
import { SingletonFactory } from '../utils/Singleton';
import * as dotenv from 'dotenv';
import { ErrorMessages, LoggerLevels, ModelNames } from '../types/enums';
import { ISpaceCreate, SpaceType } from '../models/space.model';
import { IAppointmentCreate, TIsoDatesReserved } from '../models/appointment.model';
import UtilFunctions from '../utils/UtilFunctions';
import logger from '../loggers/logger';

dotenv.config({ path: '../test.env' });

export const startServer = (app: express.Express): object => {
    return app.listen(process.env.PORT, () => {
        logger.info('Test server is listening');
    });
};

export const startDb = async (sequelize: Sequelize): Promise<void> => {
    await connectToDb(sequelize);
};

export const closeServer = async (server: any): Promise<void> => {
    await server.close();
};

export const closeDb = async (sequelize: Sequelize): Promise<void> => {
    await sequelize.close();

    logger.info('Database connection is closed');
};

export const clearDb = (sequelize: Sequelize): void => {
    Promise.all(
        Object.values(sequelize.models).map(async (model) => {
            if (model.name !== ModelNames.CITY) {
                await model.destroy({ truncate: true, cascade: true });
            }
        })
    );
};
export const clearStorage = (): void => {
    const dirPaths = [path.resolve('assets', 'images', 'users'), path.resolve('assets', 'images', 'spaces')];

    Promise.all(
        dirPaths.map(async (dirPath) => {
            await UtilFunctions.removeDirectory(dirPath, { recursive: true });
            await UtilFunctions.makeDirectory(dirPath);
        })
    );
};

export const clearDbAndStorage = async (sequelize: Sequelize): Promise<void> => {
    clearDb(sequelize);
    clearStorage();
};

export const createApplicationInstance = (): Application => {
    return SingletonFactory.produce<Application>(Application);
};

export const createUserData = (): IUserCreate => {
    return {
        name: 'Иван',
        middleName: 'Иванов',
        surname: 'Иванович',
        email: faker.internet.email(),
        password: 'TestUser123',
        passwordConfirmation: 'TestUser123',
        confirmed: true,
    };
};

export const createInvalidUserData = (): object => {
    return {
        nameShort: 'а',
        nameExceeding: 'Ааааааааааааааааааааааааааааааааааааа',
        nameWithDigits: 'Иван1',
        middleNameShort: 'а',
        middleNameExceeding: 'Петровиииииииииииииииииииииииич',
        middleNameWithDigits: 'Петрович1',
        surnameShort: 'а',
        surnameExceeding: 'Иванооооооооооооооооооооов',
        surnnameWithDigits: 'Иванов1',
        email: 'invalid email',
        passwordShort: '6digit',
        passwordExceeding: 'twentyfivedigitpassword25passcode',
    };
};

export const testUserValidationByMessages = async (
    model: any,
    userData: IUserCreate,
    message: ErrorMessages,
    expect: Function
): Promise<void> => {
    try {
        await model.create(userData);
    } catch (err) {
        expect(err.errors[0].message).toBe(message);
    }
};

export const createSpaceData = (userId: string, cityId: number, pricePerNight = 1000): ISpaceCreate => {
    return {
        address: faker.address.streetAddress(),
        pricePerNight,
        type: SpaceType.FLAT,
        roomsNumber: 2,
        imagesUrl: ['/public/images/space/1.jpg'],
        lockerConnected: false,
        facilities: ['TV'],
        description: faker.lorem.sentence(5),
        userId,
        cityId,
    };
};

export const createPathToUserAvatarDir = (userId: string) => {
    return path.resolve('assets', 'images', 'users', userId);
};

export const createPathToSpaceImagesDir = (spaceId: string) => {
    return path.resolve('assets', 'images', 'spaces', spaceId);
};

export const createAppoinmentData = (
    isoDatesReserved: TIsoDatesReserved,
    spaceId: string,
    userId: string
): IAppointmentCreate => {
    return {
        isoDatesReserved,
        userId,
        spaceId,
    };
};

export const createTokenAndSign = async <T extends object | string>(payload: T): Promise<unknown> => {
    // FIXME its not a promise
    return jwt.sign(payload, process.env.JWT_SECRET_KEY);
};

export const openTestEnv = async (applicationInstance: Application): Promise<{ server: object }> => {
    applicationInstance.setupPassport();
    applicationInstance.configureApp();
    await startDb(applicationInstance.sequelize);
    const server = startServer(applicationInstance.app); // NOTE

    return {
        server,
    };
};

export const closeTestEnv = async (sequelize: Sequelize, server: any): Promise<void> => {
    await closeDb(sequelize);
    await closeServer(server);
};