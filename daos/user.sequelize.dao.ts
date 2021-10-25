import { Dao } from '../configurations/dao.config';
import { User } from '../models/user.model';
import { SingletonFactory } from '../utils/Singleton';

export class UserSequelizeDao extends Dao {
    private readonly userModel: typeof User = User;

    get model(): typeof User {
        return this.userModel;
    }

    // FIXME
    public signUpLocal = async function (this: UserSequelizeDao, data: any): Promise<User> {
        return this.model.create(data);
    };
}

export const userSequelizeDao = SingletonFactory.produce<UserSequelizeDao>(UserSequelizeDao);
