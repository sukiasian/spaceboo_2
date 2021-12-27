import { ReduxAuthActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IAuthState {
    userIsLoggedIn: boolean;
    loginResponse?: any;
    signupResponse?: any;
}

const initialState: IAuthState = {
    userIsLoggedIn: false,
};

export const authReducer = (state = initialState, action: IAction<ReduxAuthActions>): IAuthState => {
    switch (action.type) {
        case ReduxAuthActions.FETCH_USER_IS_LOGGED_IN:
            return {
                ...state,
                userIsLoggedIn: action.payload,
            };

        case ReduxAuthActions.LOGIN_USER:
            return {
                ...state,
                loginResponse: action.payload,
            };

        case ReduxAuthActions.ANNUALIZE_LOGIN_RESPONSE:
            return {
                ...state,
                loginResponse: undefined,
            };

        case ReduxAuthActions.SIGNUP_USER:
            return {
                ...state,
                signupResponse: action.payload,
            };

        case ReduxAuthActions.ANNUALIZE_SIGNUP_RESPONSE:
            return {
                ...state,
                signupResponse: undefined,
            };

        default: {
            return { ...state };
        }
    }
};
