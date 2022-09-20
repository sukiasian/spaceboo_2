import { Dao } from '../configurations/dao.config';
import { IUserEdit, User, userEditFields, UserRoles, UserScopes } from '../models/user.model';
import { SingletonFactory } from '../utils/Singleton';
import UtilFunctions from '../utils/UtilFunctions';
import { appConfig } from '../AppConfig';

export class UserSequelizeDao extends Dao {
    private readonly userModel: typeof User = User;
    private readonly utilFunctions: typeof UtilFunctions = UtilFunctions;

    get model(): typeof User {
        return this.userModel;
    }

    public signUpLocal = async (userData: any): Promise<User> => {
        return this.model.create(userData);
    };

    public getCurrentUserById = async (userId: string): Promise<User> => {
        // если админ то в скопе должна быть роль

        const user = await this.model.scope(UserScopes.WITH_ROLE).findOne({ where: { id: userId } });

        if (user.role === UserRoles.ADMIN) {
            return user;
        }

        return this.model.scope(UserScopes.PUBLIC).findOne({
            where: {
                id: userId,
            },
        });
    };

    public getUserById = async (userId: string): Promise<User> => {
        return this.model.findOne({
            where: {
                id: userId,
            },
        });
    };

    public createAdmin = async () => {};

    public editUser = async (userId: string, userEditData: IUserEdit): Promise<void> => {
        const user = await this.model.findOne({ where: { id: userId } });

        await user.update(userEditData, { fields: userEditFields });
    };

    public updateUserAvatarInDb = async (userId: string, avatarUrl: string): Promise<void> => {
        const updateRawQuery = `UPDATE "Users" SET "avatarUrl" = '${avatarUrl}' WHERE id = '${userId}'`;

        await this.utilFunctions.createSequelizeRawQuery(appConfig.sequelize, updateRawQuery);
    };

    public removeUserAvatarFromDb = async (userId: string): Promise<void> => {
        const annualizeRawQuery = `UPDATE "Users" SET "avatarUrl" = NULL WHERE id = '${userId}'`;

        await this.utilFunctions.createSequelizeRawQuery(appConfig.sequelize, annualizeRawQuery);
    };

    public updateUserLastVerificationRequest = async (user: User): Promise<void> => {
        await user.update({ lastVerificationRequested: Date.now() });
    };
}

export const userSequelizeDao = SingletonFactory.produce<UserSequelizeDao>(UserSequelizeDao);
