import { Action } from 'redux';
import { SagaTasks } from '../../utils/types';

export const requestUserIsLoggedInAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_USER_IS_LOGGED_IN,
    };
};
