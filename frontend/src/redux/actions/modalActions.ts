import { Action } from 'redux';
import { ReduxModalAction } from '../../types/types';
import { IAction } from './ActionTypes';

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

export const toggleLockerRequestModalAction = (): IAction<ReduxModalAction> => {
    return {
        type: ReduxModalAction.TOGGLE_LOCKER_REQUEST_MODAL,
    };
};

export const toggleLockerReturnRequestModalAction = (): IAction<ReduxModalAction> => {
    return {
        type: ReduxModalAction.TOGGLE_LOCKER_RETURN_REQUEST_MODAL,
    };
};

export const toggleConfirmDialogAction = (): IAction<ReduxModalAction> => {
    return {
        type: ReduxModalAction.TOGGLE_CONFIRM_DIALOG,
    };
};

export const toggleAppointmentDatePickerAction = (): IAction<ReduxModalAction> => {
    return {
        type: ReduxModalAction.TOGGLE_APPOINTMENT_DATE_PICKER,
    };
};
