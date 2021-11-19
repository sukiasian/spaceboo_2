import { Dao } from '../configurations/dao.config';
import { User } from '../models/user.model';
import { SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { applicationInstance } from '../App';

export class UserSequelizeDao extends Dao {
    private readonly userModel: typeof User = User;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    get model(): typeof User {
        return this.userModel;
    }

    public signUpLocal = async (userData: any): Promise<User> => {
        return this.model.create(userData);
    };

    public editUserById;

    public updateUserImage = async (userId: string, avatarUrl: string): Promise<void> => {
        const user: User = await this.findById(userId);

        const updateQuery = `UPDATE "Users" SET "avatarUrl" = '${avatarUrl}' WHERE id = '${userId}'`;

        await this.utilFunctions.createSequelizeRawQuery(applicationInstance.sequelize, updateQuery);
        const freshUser = await this.findById(userId);
    };
}

export const userSequelizeDao = SingletonFactory.produce<UserSequelizeDao>(UserSequelizeDao);
