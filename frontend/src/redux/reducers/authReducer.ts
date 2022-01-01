import { ReduxAuthActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

interface IUserLoginState {
    loggedIn: boolean;
    confirmed: boolean;
}

export interface IAuthState {
    userLoginState: IUserLoginState;
    loginResponse?: any;
    signupResponse?: any;
    logoutResponse?: any;
}

const initialState: IAuthState = {
    userLoginState: {
        loggedIn: false,
        confirmed: false,
    },
};

export const authReducer = (state = initialState, action: IAction<ReduxAuthActions>): IAuthState => {
    switch (action.type) {
        case ReduxAuthActions.FETCH_USER_IS_LOGGED_IN:
            return {
                ...state,
                userLoginState: action.payload,
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

        case ReduxAuthActions.LOGOUT_USER:
            return {
                ...state,
                logoutResponse: action.payload,
            };

        case ReduxAuthActions.ANNUALIZE_LOGOUT_RESPONSE:
            return {
                ...state,
                logoutResponse: undefined,
            };

        default: {
            return { ...state };
        }
    }
};
