import { Dao } from '../configurations/dao.config';
import { User } from '../models/user.model';
import { ErrorMessages, HttpStatus } from '../types/enums';
import AppError from '../utils/AppError';
import { SingletonFactory } from '../utils/Singleton';

export class AuthSequelizeDao extends Dao {
    private readonly userModel: typeof User = User;

    get model(): typeof User {
        return this.userModel;
    }

    public signUpLocal = async (data: any): Promise<User> => {
        // NOTE we do so because password and passwordConfirmation are required
        if (data.password && data.passwordConfirmation) {
            return this.model.create(data);
        } else {
            throw new AppError(HttpStatus.BAD_REQUEST, ErrorMessages.PASSPORT_IS_NOT_VALID);
        }
    };
}

export const authSequelizeDao = SingletonFactory.produce<AuthSequelizeDao>(AuthSequelizeDao);
