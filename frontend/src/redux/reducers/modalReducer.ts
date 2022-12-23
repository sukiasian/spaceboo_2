import { ReduxModalAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IModalState {
    loginModalIsOpen?: boolean;
    signupModalIsOpen?: boolean;
    editSpaceModalIsOpen?: boolean;
    pairLockerModalIsOpen?: boolean;
    lockerRequestModalIsOpen?: boolean;
    lockerReturnRequestModalIsOpen?: boolean;
    confirmDialogIsOpen?: boolean;
    appointmentDatePickerIsOpen?: boolean;
}

const initialState: IModalState = {};

export const modalReducer = (state = initialState, action: IAction): IModalState => {
    switch (action.type) {
        case ReduxModalAction.TOGGLE_LOGIN_MODAL:
            return {
                ...state,
                loginModalIsOpen: !state.loginModalIsOpen,
            };

        case ReduxModalAction.TOGGLE_SIGNUP_MODAL:
            return {
                ...state,
                signupModalIsOpen: !state.signupModalIsOpen,
            };

        case ReduxModalAction.TOGGLE_EDIT_SPACE_MODAL:
            return {
                ...state,
                editSpaceModalIsOpen: !state.editSpaceModalIsOpen,
            };

        case ReduxModalAction.TOGGLE_PAIR_LOCKER_MODAL:
            return {
                ...state,
                pairLockerModalIsOpen: !state.pairLockerModalIsOpen,
            };

        case ReduxModalAction.TOGGLE_LOCKER_REQUEST_MODAL:
            return {
                ...state,
                lockerRequestModalIsOpen: !state.lockerRequestModalIsOpen,
            };

        case ReduxModalAction.TOGGLE_LOCKER_RETURN_REQUEST_MODAL:
            return {
                ...state,
                lockerReturnRequestModalIsOpen: !state.lockerReturnRequestModalIsOpen,
            };

        case ReduxModalAction.TOGGLE_CONFIRM_DIALOG:
            return {
                ...state,
                confirmDialogIsOpen: !state.confirmDialogIsOpen,
            };

        case ReduxModalAction.TOGGLE_APPOINTMENT_DATE_PICKER:
            return {
                ...state,
                appointmentDatePickerIsOpen: !state.appointmentDatePickerIsOpen,
            };

        default:
            return {
                ...state,
            };
    }
};
