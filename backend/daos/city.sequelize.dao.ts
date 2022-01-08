import { query } from 'express';
import { Op } from 'sequelize';
import { FindOptions } from 'sequelize/types';
import { applicationInstance } from '../App';
import { Dao } from '../configurations/dao.config';
import { IFindCitiesQuery } from '../controllers/city.controller';
import { City } from '../models/city.model';
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
                address: {
                    [Op.iLike]: searchPattern,
                },
            };
        }

        return this.model.findAll(sequelizeQuery);
    };

    public getMajorCities = async (): Promise<City[]> => {
        // NOTE FIXME местами city.address местами city.city. Что делать ?
        let majorCities = ['Москва', 'Краснодар', 'Сочи', 'Новосибирск', 'Санкт-Петербург', 'Красноярск'];

        majorCities = majorCities.map((city: string) => {
            return `'${city}'`;
        });

        // const query = `SELECT * FROM "Cities" c WHERE c."city" LIKE any (array[(${majorCities})]) OR c."address" LIKE any (array[(${majorCities})]);`;
        const query = `SELECT * FROM "Cities" c WHERE c."address" LIKE (${majorCities});`;

        return (await this.utilFunctions.createSequelizeRawQuery(applicationInstance.sequelize, query)) as City[];
    };
}

export const citySequelizeDao = SingletonFactory.produce<CitySequelizeDao>(CitySequelizeDao);
