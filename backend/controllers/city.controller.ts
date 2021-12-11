import * as dotenv from 'dotenv';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { ResponseMessages } from '../types/enums';
import UtilFunctions from '../utils/UtilFunctions';
import { citySequelizeDao, CitySequelizeDao } from '../daos/city.sequelize.dao';

export class CityController extends Singleton {
    private readonly dao: CitySequelizeDao = citySequelizeDao;

    public getCitiesByCityToSearch = UtilFunctions.catchAsync(async (req, res, next) => {
        // NOTE we need to get cities by query - as if we type it in an input field with drop down list of cities as a result
        const cities = await this.dao.getCitiesByCityToSearch(req.body.cityToSearch);

        UtilFunctions.sendResponse(res)(201, ResponseMessages.USER_CREATED, cities);
    });
}

export const cityController = SingletonFactory.produce<CityController>(CityController);
