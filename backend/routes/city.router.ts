import { Router } from 'express';
import { cityController, CityController } from '../controllers/city.controller';
import { redis } from '../Redis';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class CityRouter extends Singleton implements IRouter {
    private readonly cityController: CityController = cityController;
    private readonly redisClient = redis.client;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router.route('/').get(this.cityController.getCitiesByQuery);
        this.router.route('/majors').get(this.cityController.getMajorCities);

        this.router.get('/a', async (req, res) => {
            if (!req.cookies['attempts']) {
                res.cookie('attempts', 0);
            } else {
                res.cookie('attempts', parseInt(req.cookies['attempts'], 10) + 1);
            }

            console.log(req.ip);

            await this.redisClient.set('a', JSON.stringify({ b: 'hello' }));

            console.log(await this.redisClient.get('a'));
            console.log(await this.redisClient.get('sdfsdfds'), 'aaaa');

            res.send('helllo');

            // записать в сервере ip адрес и аттемпты
        });
    };
}

const cityRouter = SingletonFactory.produce<CityRouter>(CityRouter);

cityRouter.prepareRouter();

export const router = cityRouter.router;
