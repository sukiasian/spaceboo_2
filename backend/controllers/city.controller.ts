import * as dotenv from 'dotenv';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { HttpStatus, ResponseMessages } from '../types/enums';
import UtilFunctions from '../utils/UtilFunctions';
import { citySequelizeDao, CitySequelizeDao } from '../daos/city.sequelize.dao';

export interface IFindCitiesQuery {
    searchPattern: string;
}

export class CityController extends Singleton {
    private readonly dao: CitySequelizeDao = citySequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public getCityByCityToSearch = UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        // NOTE we need to get cities by query - as if we type it in an input field with drop down list of cities as a result
        const cities = await this.dao.getCityByCityToSearch(req.body.cityToSearch);

        this.utilFunctions.sendResponse(res)(201, ResponseMessages.USER_CREATED, cities);
    });

    public getCitiesByQuery = UtilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const cities = await this.dao.getCitiesByQuery(req.query);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, cities);
    });
}

export const cityController = SingletonFactory.produce<CityController>(CityController);
