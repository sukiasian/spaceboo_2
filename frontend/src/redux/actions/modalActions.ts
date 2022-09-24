import { Action } from 'redux';
import { ReduxModalAction } from '../../types/types';

export const toggleLoginModalAction = (): Action => {
    return {
        type: ReduxModalAction.TOGGLE_LOGIN_MODAL,
    };
};

export const toggleSignupModalAction = (): Action => {
    return {
        type: ReduxModalAction.TOGGLE_SIGNUP_MODAL,
    };
};

export const toggleEditSpaceModalAction = (): Action => {
    return {
        type: ReduxModalAction.TOGGLE_EDIT_SPACE_MODAL,
    };
};

export const togglePairLockerModal = (): Action => {
    return {
        type: ReduxModalAction.TOGGLE_PAIR_LOCKER_MODAL,
    };
};
