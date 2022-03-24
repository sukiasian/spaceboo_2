import { ReduxModalAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IModalState {
    loginModalIsOpen: boolean;
    signupModalIsOpen: boolean;
    editSpaceModalIsOpen: boolean;
}

const initialState: IModalState = {
    loginModalIsOpen: false,
    signupModalIsOpen: false,
    editSpaceModalIsOpen: false,
};

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

        default:
            return {
                ...state,
            };
    }
};
