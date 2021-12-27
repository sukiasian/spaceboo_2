import { Action } from 'redux';
import { ReduxModalActions } from '../../types/types';

export const toggleLoginModalAction = (): Action => {
    return {
        type: ReduxModalActions.TOGGLE_LOGIN_MODAL,
    };
};

export const toggleSignupModalAction = (): Action => {
    return {
        type: ReduxModalActions.TOGGLE_SIGNUP_MODAL,
    };
};
