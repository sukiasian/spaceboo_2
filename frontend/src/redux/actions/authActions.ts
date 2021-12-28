import { Action } from 'redux';
import { ILoginData } from '../../forms/LoginForm';
import { ISignupData } from '../../forms/SignupForm';
import { ReduxAuthActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export const requestUserIsLoggedInAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_USER_IS_LOGGED_IN,
    };
};

export const requestUserLogoutAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_USER_LOGOUT,
    };
};

export const postLoginAction = (payload: ILoginData): IAction<SagaTasks> => {
    return {
        type: SagaTasks.POST_LOGIN,
        payload,
    };
};

export const postSignupAction = (payload: ISignupData): IAction<SagaTasks> => {
    return {
        type: SagaTasks.POST_SIGNUP,
        payload,
    };
};

export const loginUserAction = (payload: any): IAction<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.LOGIN_USER,
        payload,
    };
};

export const annualizeLoginResponseAction = (): Action<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.ANNUALIZE_LOGIN_RESPONSE,
    };
};

export const signupUserAction = (payload: any): IAction<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.SIGNUP_USER,
        payload,
    };
};

export const annualizeSignupResponseAction = (): Action<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.ANNUALIZE_SIGNUP_RESPONSE,
    };
};

export const logoutUserAction = (payload: any): IAction<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.LOGOUT_USER,
        payload,
    };
};
