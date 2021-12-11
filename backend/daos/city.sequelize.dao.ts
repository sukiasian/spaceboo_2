import { Dao } from '../configurations/dao.config';
import { City } from '../models/city.model';
import { SingletonFactory } from '../utils/Singleton';

export class CitySequelizeDao extends Dao {
    private readonly cityModel: typeof City = City;

    get model(): typeof City {
        return this.cityModel;
    }

    public getCitiesByCityToSearch = async (cityToSearch?: string): Promise<City[]> => {
        const query = cityToSearch ?? {};

        return this.model.findAll(query);
    };
}

export const citySequelizeDao = SingletonFactory.produce<CitySequelizeDao>(CitySequelizeDao);
