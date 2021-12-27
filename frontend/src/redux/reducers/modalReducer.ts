import { ReduxModalActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IModalState {
    loginModalIsOpen: boolean;
    signupModalIsOpen: boolean;
}

const initialState: IModalState = {
    loginModalIsOpen: false,
    signupModalIsOpen: false,
};

export const modalReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case ReduxModalActions.TOGGLE_LOGIN_MODAL:
            return {
                ...state,
                loginModalIsOpen: !state.loginModalIsOpen,
            };

        case ReduxModalActions.TOGGLE_SIGNUP_MODAL:
            return {
                ...state,
                signupModalIsOpen: !state.signupModalIsOpen,
            };

        default:
            return {
                ...state,
            };
    }
};
