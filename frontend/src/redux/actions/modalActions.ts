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

export const toggleEditSpaceModalAction = (): Action => {
    return {
        type: ReduxModalActions.TOGGLE_EDIT_SPACE_MODAL,
    };
};
