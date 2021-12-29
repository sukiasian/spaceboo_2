import { Dao } from '../configurations/dao.config';
import {
    changeUserPasswordFields,
    IUserPasswordChange,
    User,
    userConfirmedField,
    userCreateFields,
    UserScopes,
} from '../models/user.model';
import { ErrorMessages, HttpStatus } from '../types/enums';
import AppError from '../utils/AppError';
import { SingletonFactory } from '../utils/Singleton';

export class AuthSequelizeDao extends Dao {
    private readonly userModel: typeof User = User;

    get model(): typeof User {
        return this.userModel;
    }

    // FIXME fix data - use userData and pick a proper datatype
    public signUpLocal = async (userData: any): Promise<User> => {
        if (userData.password && userData.passwordConfirmation) {
            return this.model.create(userData, { fields: userCreateFields });
        } else {
            throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.PASSWORD_IS_NOT_VALID);
        }
    };

    public editUserPassword = async (
        userId: string,
        passwordResetData: IUserPasswordChange,
        recovery: boolean = false
    ) => {
        const user = await this.model.scope(UserScopes.WITH_PASSWORD).findOne({ where: { id: userId } });

        if (!recovery) {
            if (passwordResetData.oldPassword && !(await user.verifyPassword(user)(passwordResetData.oldPassword))) {
                throw new AppError(HttpStatus.FORBIDDEN, ErrorMessages.PASSWORD_INCORRECT);
            } else if (!passwordResetData.oldPassword) {
                throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.PASSWORDS_DO_NOT_MATCH);
            }
        }

        await user.update(
            {
                password: passwordResetData.password,
                passwordConfirmation: passwordResetData.passwordConfirmation,
            },
            { fields: changeUserPasswordFields }
        );
    };

    public confirmAccount = async (userId: string) => {
        const user = await this.model.scope(UserScopes.WITH_CONFIRMED).findOne({ where: { id: userId } });

        await user.update({ confirmed: true }, { fields: userConfirmedField });
    };
}

export const authSequelizeDao = SingletonFactory.produce<AuthSequelizeDao>(AuthSequelizeDao);
