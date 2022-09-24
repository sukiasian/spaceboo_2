import { Router } from 'express';
import { lockerController, LockerController } from '../controllers/locker.controller';
import { RouteProtector } from '../utils/RouteProtector';
import { Singleton, SingletonFactory } from '../utils/Singleton';
import { IRouter } from './router';

class LockerRouter extends Singleton implements IRouter {
    private readonly controller: LockerController = lockerController;
    public readonly router = Router();

    public prepareRouter = (): void => {
        this.router
            .route('/')
            .get(RouteProtector.adminOnlyProtector, this.controller.getLockersByQuery)
            .post(RouteProtector.adminOnlyProtector, this.controller.pairLockerForSpace)
            .delete(RouteProtector.adminOnlyProtector, this.controller.unpairLockerForSpace);
    };
}

const lockerRouter = SingletonFactory.produce<LockerRouter>(LockerRouter);

lockerRouter.prepareRouter();

export const router = lockerRouter.router;

/* 

❓req.body vs req.query
    ✅ Нам не нужно получение локера, но удаление и редактирование нужно.  Поэтому при создании мы будем использовать req.body, а при редактировании и удалении req.query.

❓у нас нет отдельного репозитория locker - все операции с lockerId ведутся через изменение поля lockerId в Space. Может стоит все это дело прописать в space controller ?

    Можно пойти 2 путями:
    - все что связано с регистрацией делается через модуль space: 
        /:spaceId/lockers/requests

    - все делается напрямую через модуль locker
        в этом случае нам  придется инджектнуть spaceModel в lockerDao чтобы менять значения locker-a. 
        ✅ ИЛИ создать модель Locker которая ссылается на Space? и изменяя id у экземпляра Locker мы изменим lockerId у экземпляра Space. Тогда нам не нужно будет инджектить



❓Как отправлять запросы на ttlock - напрямую отправляя запрос к ним или через бэкенд?  
    ✅ проксировать через наш сервер - это безопасно.
        ==>>> нужен отдельный модуль ttlock


    Итого:
    - создать модель 
    - все делать через модуль Locker, не трогая Space.
*/
