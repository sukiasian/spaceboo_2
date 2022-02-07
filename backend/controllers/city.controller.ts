import * as dotenv from 'dotenv';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { HttpStatus } from '../types/enums';
import UtilFunctions from '../utils/UtilFunctions';
import { citySequelizeDao, CitySequelizeDao } from '../daos/city.sequelize.dao';

export interface IFindCitiesQuery {
    searchPattern: string;
}

export class CityController extends Singleton {
    private readonly dao: CitySequelizeDao = citySequelizeDao;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    public getCitiesByQuery = this.utilFunctions.catchAsync(async (req, res, next): Promise<void> => {
        const cities = await this.dao.getCitiesByQuery(req.query);

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, cities);
    });

    public getMajorCities = this.utilFunctions.catchAsync(async (req, res, next) => {
        const cities = await this.dao.getMajorCities();

        this.utilFunctions.sendResponse(res)(HttpStatus.OK, null, cities);
    });
}

export const cityController = SingletonFactory.produce<CityController>(CityController);
