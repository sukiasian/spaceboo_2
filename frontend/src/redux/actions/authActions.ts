import { Action } from 'redux';
import { ILoginData } from '../../forms/LoginForm';
import { IPasswordChangeFormData } from '../../forms/PasswordChangeForm';
import { ISignupData } from '../../forms/SignupForm';
import { IServerResponse, ReduxAuthActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export const postLogoutUserAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.POST_LOGOUT_USER,
    };
};

export const postLoginUserAction = (payload: ILoginData): IAction<SagaTasks, ILoginData> => {
    return {
        type: SagaTasks.POST_LOGIN_USER,
        payload,
    };
};

export const postSignupUserAction = (payload: ISignupData): IAction<SagaTasks, ISignupData> => {
    return {
        type: SagaTasks.POST_SIGNUP_USER,
        payload,
    };
};

export const postPasswordChange = (payload: IPasswordChangeFormData): IAction<SagaTasks> => {
    return {
        type: SagaTasks.POST_PASSWORD_CHANGE,
        payload,
    };
};

export const fetchUserLoginStateAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.FETCH_USER_LOGIN_STATE,
    };
};

export const setFetchUserLoginStateSuccessResponseAction = (
    payload: IServerResponse & { isLoaded: boolean }
): IAction<ReduxAuthActions, IServerResponse> => {
    return {
        type: ReduxAuthActions.SET_FETCH_USER_IS_LOGGED_IN_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchUserLoginStateFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthActions, IServerResponse> => {
    return {
        type: ReduxAuthActions.SET_FETCH_USER_IS_LOGGED_IN_FAILURE_RESPONSE,
        payload,
    };
};

export const setPostLoginSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthActions, IServerResponse> => {
    return {
        type: ReduxAuthActions.SET_POST_LOGIN_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostLoginFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthActions, IServerResponse> => {
    return {
        type: ReduxAuthActions.SET_POST_LOGIN_USER_FAILURE_RESPONSE,
        payload,
    };
};

export const setPasswordChangeFormData = (
    passwordChangeData: IPasswordChangeFormData
): IAction<ReduxAuthActions, IPasswordChangeFormData> => {
    return {
        type: ReduxAuthActions.SET_PASSWORD_CHANGE_FORM_DATA,
        payload: passwordChangeData,
    };
};

export const setPostPasswordChangeSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxAuthActions, IServerResponse> => {
    return {
        type: ReduxAuthActions.SET_POST_PASSWORD_CHANGE_SUCCESS_RESPONSE,
        payload,
    };
};
export const setPostPasswordChangeFailureResponse = (
    payload: IServerResponse
): IAction<ReduxAuthActions, IServerResponse> => {
    return {
        type: ReduxAuthActions.SET_POST_PASSWORD_CHANGE_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizePostPasswordChangeResponses = (): IAction<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.ANNUALIZE_POST_PASSWORD_CHANGE_RESPONSES,
    };
};

export const annualizeLoginResponseAction = (): Action<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.ANNUALIZE_POST_LOGIN_USER_RESPONSES,
    };
};

export const setPostSignupUserSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxAuthActions, IServerResponse> => {
    return {
        type: ReduxAuthActions.SET_POST_SIGNUP_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostSignupUserFailureResponse = (
    payload: IServerResponse
): IAction<ReduxAuthActions, IServerResponse> => {
    return {
        type: ReduxAuthActions.SET_POST_SIGNUP_USER_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizeSignupResponseAction = (): Action<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.ANNUALIZE_POST_SIGNUP_USER_RESPONSES,
    };
};

export const setFetchLogoutUserSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthActions, IServerResponse> => {
    return {
        type: ReduxAuthActions.SET_FETCH_LOGOUT_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchLogoutUserFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthActions, IServerResponse> => {
    return {
        type: ReduxAuthActions.SET_FETCH_LOGOUT_USER_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizeFetchLogoutResponseAction = (): IAction<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.ANNUALIZE_FETCH_LOGOUT_USER_RESPONSES,
    };
};
