import { Op } from 'sequelize';
import { FindOptions } from 'sequelize/types';
import { Dao } from '../configurations/dao.config';
import { IFindCitiesQuery } from '../controllers/city.controller';
import { City } from '../models/city.model';
import { SingletonFactory } from '../utils/Singleton';

export class CitySequelizeDao extends Dao {
    private readonly cityModel: typeof City = City;

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
                address: {
                    [Op.iLike]: searchPattern,
                },
            };
        }

        return this.model.findAll(sequelizeQuery);
    };
}

export const citySequelizeDao = SingletonFactory.produce<CitySequelizeDao>(CitySequelizeDao);
