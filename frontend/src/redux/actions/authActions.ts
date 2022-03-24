import { Action } from 'redux';
import { ILoginData } from '../../forms/LoginForm';
import { IPasswordChangeFormData } from '../../forms/PasswordChangeForm';
import { ISignupData } from '../../forms/SignupForm';
import { IServerResponse, ReduxAuthAction, SagaTask } from '../../types/types';
import { IAction } from './ActionTypes';

export const postLogoutUserAction = (): Action<SagaTask> => {
    return {
        type: SagaTask.POST_LOGOUT_USER,
    };
};

export const postLoginUserAction = (payload: ILoginData): IAction<SagaTask, ILoginData> => {
    return {
        type: SagaTask.POST_LOGIN_USER,
        payload,
    };
};

export const postSignupUserAction = (payload: ISignupData): IAction<SagaTask, ISignupData> => {
    return {
        type: SagaTask.POST_SIGNUP_USER,
        payload,
    };
};

export const postPasswordChange = (payload: IPasswordChangeFormData): IAction<SagaTask> => {
    return {
        type: SagaTask.POST_PASSWORD_CHANGE,
        payload,
    };
};

export const fetchUserLoginStateAction = (): Action<SagaTask> => {
    return {
        type: SagaTask.FETCH_USER_LOGIN_STATE,
    };
};

export const setFetchUserLoginStateSuccessResponseAction = (
    payload: IServerResponse & { isLoaded: boolean }
): IAction<ReduxAuthAction, IServerResponse> => {
    return {
        type: ReduxAuthAction.SET_FETCH_USER_IS_LOGGED_IN_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchUserLoginStateFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthAction, IServerResponse> => {
    return {
        type: ReduxAuthAction.SET_FETCH_USER_IS_LOGGED_IN_FAILURE_RESPONSE,
        payload,
    };
};

export const setPostLoginSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthAction, IServerResponse> => {
    return {
        type: ReduxAuthAction.SET_POST_LOGIN_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostLoginFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthAction, IServerResponse> => {
    return {
        type: ReduxAuthAction.SET_POST_LOGIN_USER_FAILURE_RESPONSE,
        payload,
    };
};

export const setPasswordChangeFormDataAction = (
    passwordChangeData: IPasswordChangeFormData
): IAction<ReduxAuthAction, IPasswordChangeFormData> => {
    return {
        type: ReduxAuthAction.SET_PASSWORD_CHANGE_FORM_DATA,
        payload: passwordChangeData,
    };
};

export const setPostPasswordChangeSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthAction, IServerResponse> => {
    return {
        type: ReduxAuthAction.SET_POST_PASSWORD_CHANGE_SUCCESS_RESPONSE,
        payload,
    };
};
export const setPostPasswordChangeFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthAction, IServerResponse> => {
    return {
        type: ReduxAuthAction.SET_POST_PASSWORD_CHANGE_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizePostPasswordChangeResponsesAction = (): IAction<ReduxAuthAction> => {
    return {
        type: ReduxAuthAction.ANNUALIZE_POST_PASSWORD_CHANGE_RESPONSES,
    };
};

export const annualizeLoginResponseAction = (): Action<ReduxAuthAction> => {
    return {
        type: ReduxAuthAction.ANNUALIZE_POST_LOGIN_USER_RESPONSES,
    };
};

export const setPostSignupUserSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthAction, IServerResponse> => {
    return {
        type: ReduxAuthAction.SET_POST_SIGNUP_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostSignupUserFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthAction, IServerResponse> => {
    return {
        type: ReduxAuthAction.SET_POST_SIGNUP_USER_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizeSignupResponseAction = (): Action<ReduxAuthAction> => {
    return {
        type: ReduxAuthAction.ANNUALIZE_POST_SIGNUP_USER_RESPONSES,
    };
};

export const setFetchLogoutUserSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthAction, IServerResponse> => {
    return {
        type: ReduxAuthAction.SET_FETCH_LOGOUT_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchLogoutUserFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAuthAction, IServerResponse> => {
    return {
        type: ReduxAuthAction.SET_FETCH_LOGOUT_USER_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizeFetchLogoutResponseAction = (): IAction<ReduxAuthAction> => {
    return {
        type: ReduxAuthAction.ANNUALIZE_FETCH_LOGOUT_USER_RESPONSES,
    };
};
