import { query } from 'express';
import { Op } from 'sequelize';
import { FindOptions } from 'sequelize/types';
import { appConfig } from '../AppConfig';
import { Dao } from '../configurations/dao.config';
import { IFindCitiesQuery } from '../controllers/city.controller';
import { City } from '../models/city.model';
import { District } from '../models/district.model';
import { Region } from '../models/region.model';
import { SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';

export class CitySequelizeDao extends Dao {
    private readonly cityModel: typeof City = City;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    get model(): typeof City {
        return this.cityModel;
    }

    public getCityByCityToSearch = async (cityToSearch?: string): Promise<City[]> => {
        const query = cityToSearch ?? {};

        // FIXME wont work
        return this.model.findAll(query);
    };

    public getCitiesByQuery = async (query: IFindCitiesQuery): Promise<City[]> => {
        const { searchPattern } = query;
        let sequelizeQuery: FindOptions<City> = {};

        if (searchPattern) {
            sequelizeQuery.where = {
                name: {
                    [Op.iLike]: searchPattern,
                },
            };
        }

        sequelizeQuery.include = [Region];

        return this.model.findAll(sequelizeQuery);
    };

    public getMajorCities: any;
}

export const citySequelizeDao = SingletonFactory.produce<CitySequelizeDao>(CitySequelizeDao);
