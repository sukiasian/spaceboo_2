import { IPasswordChangeFormData } from '../../forms/PasswordChangeForm';
import { IServerResponse, ReduxAuthAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IUserLoginState {
    loggedIn: boolean;
    confirmed: boolean;
    isLoaded: boolean;
}

export interface IAuthState {
    postLoginUserSuccessResponse?: IServerResponse;
    postLoginUserFailureResponse?: IServerResponse;
    postSignupUserSuccessResponse?: IServerResponse;
    postSignupUserFailureResponse?: IServerResponse;
    postPasswordChangeSuccessResponse?: IServerResponse;
    postPasswordChangeFailureResponse?: IServerResponse;
    fetchUserLoginStateSuccessResponse?: IServerResponse<IUserLoginState & { isLoaded: boolean }>;
    fetchUserLoginStateFailureResponse?: IServerResponse;
    fetchLogoutUserSuccessResponse?: IServerResponse;
    fetchLogoutUserFailureResponse?: IServerResponse;
    passwordChangeFormData?: IPasswordChangeFormData;
}

const initialState: IAuthState = {};

export const authReducer = (state = initialState, action: IAction<ReduxAuthAction>): IAuthState => {
    switch (action.type) {
        case ReduxAuthAction.SET_POST_LOGIN_USER_SUCCESS_RESPONSE:
            return {
                ...state,
                postLoginUserSuccessResponse: action.payload,
            };

        case ReduxAuthAction.SET_POST_LOGIN_USER_FAILURE_RESPONSE:
            return {
                ...state,
                postLoginUserFailureResponse: action.payload,
            };

        case ReduxAuthAction.ANNUALIZE_POST_LOGIN_USER_RESPONSES:
            return {
                ...state,
                postLoginUserSuccessResponse: undefined,
                postLoginUserFailureResponse: undefined,
            };

        case ReduxAuthAction.SET_POST_SIGNUP_USER_SUCCESS_RESPONSE:
            return {
                ...state,
                postSignupUserSuccessResponse: action.payload,
            };

        case ReduxAuthAction.SET_POST_SIGNUP_USER_FAILURE_RESPONSE:
            return {
                ...state,
                postSignupUserFailureResponse: action.payload,
            };

        case ReduxAuthAction.ANNUALIZE_POST_SIGNUP_USER_RESPONSES:
            return {
                ...state,
                postSignupUserSuccessResponse: undefined,
            };

        case ReduxAuthAction.SET_FETCH_LOGOUT_USER_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchLogoutUserSuccessResponse: action.payload,
            };

        case ReduxAuthAction.SET_FETCH_LOGOUT_USER_FAILURE_RESPONSE:
            return {
                ...state,
                fetchLogoutUserFailureResponse: action.payload,
            };

        // NOTE: что должно здесь произойти? нужно ли вообще аннулирование? наверное да, так как если пользователь выйдет а затем зайдет то получится так что logout response все еще определен.
        case ReduxAuthAction.ANNUALIZE_FETCH_LOGOUT_USER_RESPONSES:
            return {
                ...state,
                fetchLogoutUserSuccessResponse: undefined,
                fetchLogoutUserFailureResponse: undefined,
            };

        case ReduxAuthAction.SET_FETCH_USER_IS_LOGGED_IN_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchUserLoginStateSuccessResponse: action.payload,
            };

        case ReduxAuthAction.SET_FETCH_USER_IS_LOGGED_IN_FAILURE_RESPONSE:
            return {
                ...state,
                fetchUserLoginStateFailureResponse: action.payload,
            };

        case ReduxAuthAction.SET_PASSWORD_CHANGE_FORM_DATA:
            return {
                ...state,
                passwordChangeFormData: action.payload,
            };

        case ReduxAuthAction.SET_POST_PASSWORD_CHANGE_SUCCESS_RESPONSE:
            return {
                ...state,
                postPasswordChangeSuccessResponse: action.payload,
            };

        case ReduxAuthAction.SET_POST_PASSWORD_CHANGE_FAILURE_RESPONSE:
            return {
                ...state,
                postPasswordChangeFailureResponse: action.payload,
            };

        case ReduxAuthAction.ANNUALIZE_POST_PASSWORD_CHANGE_RESPONSES:
            return {
                ...state,
                postPasswordChangeSuccessResponse: undefined,
                postPasswordChangeFailureResponse: undefined,
            };

        default: {
            return { ...state };
        }
    }
};
