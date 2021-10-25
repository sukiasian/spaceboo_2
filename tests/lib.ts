import * as express from 'express';
import * as faker from 'faker';
import * as jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { Sequelize } from 'sequelize-typescript';
import { Application } from '../App';
import { IUserCreate } from '../models/user.model';
import connectToDb from '../database/connectToDb';
import { SingletonFactory } from '../utils/Singleton';
import * as dotenv from 'dotenv';
import { ErrorMessages, ModelNames } from '../types/enums';
import { ISpaceCreate, SpaceType } from '../models/space.model';

dotenv.config({ path: '../test.env' });

export const startServer = (app: express.Express): object => {
    return app.listen(process.env.PORT, () => {
        console.log('Test server is listening');
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
    console.log('Database connection is closed');
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

export const createApplicationInstance = (): Application => {
    return SingletonFactory.produce<Application>(Application);
};

export const createUserData = (): IUserCreate => {
    return {
        name: faker.name.firstName(),
        middleName: faker.name.firstName(),
        surname: faker.name.lastName(),
        email: 'testuser@gmail.com',
        password: 'TestUser123',
        passwordConfirmation: 'TestUser123',
    };
};

export const createInvalidUserData = (): object => {
    return {
        nameShort: 'a', // NOTE should not include numbers!
        nameExceeding: 'hugenameconsistingofmorethantwentyfive',
        nameWithDigits: 'testName7',
        middleNameShort: 'a',
        middleNameExceeding: 'hugenameconsistingofmorethantwentyfive',
        middleNameWithDigits: 'testMiddleName7',
        surnameShort: 'a', // NOTE should not include numbers!
        surnameExceeding: 'hugenameconsistingofmorethantwentyfive',
        surnnameWithDigits: 'testSurname7',
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

export const createSpaceData = (userId: string, cityId: number): ISpaceCreate => {
    return {
        address: faker.address.streetAddress(),
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

// export const createDatesToReserve = (beginningDate: string, endingDate: string, space: Space): TDatesReserved => {
//     return [
//         { inclusive: true, value: createCustomDate(beginningDate, space['city.timezone']) },
//         { inclusive: false, value: createCustomDate(endingDate, space['city.timezone']) },
//     ];
// };
// const timeValueToDoubleDigitParser = (value) => {
//     return value > 9 ? `${value}` : `0${value}`;
// };

// export const createCustomDate = (dateRawValue: string, timezone: string): string => {
//     const date = new Date(dateRawValue);
//     const year = date.getFullYear();
//     const month = timeValueToDoubleDigitParser(date.getMonth() + 1);
//     const day = timeValueToDoubleDigitParser(date.getDate());
//     const hours = timeValueToDoubleDigitParser(date.getHours());
//     const minutes = timeValueToDoubleDigitParser(date.getMinutes());
//     const seconds = timeValueToDoubleDigitParser(date.getSeconds());
//     let milliseconds: any = date.getMilliseconds() / 1000;
//     milliseconds = Math.floor(milliseconds.toFixed(2) * 100);

//     return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${UtilFunctions.timezoneParser(
//         timezone
//     )}`;
// };

export const createTokenAndSign = async (payload: string | object): Promise<string> => {
    const signToken = promisify(jwt.sign);

    switch (typeof payload) {
        case 'string':
            return signToken(payload, process.env.JWT_SECRET_KEY) as Promise<string>;

        case 'object':
            return signToken(payload as object, process.env.JWT_SECRET_KEY) as Promise<string>;
    }
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
