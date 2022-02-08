import { Action } from 'redux';
import { ILoginData } from '../../forms/LoginForm';
import { ISignupData } from '../../forms/SignupForm';
import { IServerResponse, ReduxAuthActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export const requestUserLoginStateAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_USER_LOGIN_STATE,
    };
};

export const requestLogoutUserAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_LOGOUT_USER,
    };
};

export const requestLoginUserAction = (payload: ILoginData): IAction<SagaTasks, ILoginData> => {
    return {
        type: SagaTasks.REQUEST_LOGIN_USER,
        payload,
    };
};

export const requestSignupUserAction = (payload: ISignupData): IAction<SagaTasks, ISignupData> => {
    return {
        type: SagaTasks.REQUEST_SIGNUP_USER,
        payload,
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

export const annualizeLoginResponseAction = (): Action<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.ANNUALIZE_LOGIN_USER_RESPONSES,
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
        type: ReduxAuthActions.ANNUALIZE_SIGNUP_USER_RESPONSES,
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

export const annualizeLogoutResponseAction = (): IAction<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.ANNUALIZE_LOGOUT_USER_RESPONSES,
    };
};
