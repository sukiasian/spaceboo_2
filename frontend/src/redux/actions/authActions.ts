import { Action } from 'redux';
import { ILoginData } from '../../components/LoginForm';
import { ISignupData } from '../../components/SignupForm';
import { ReduxAuthActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export const requestUserIsLoggedInAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_USER_IS_LOGGED_IN,
    };
};

export const postLoginAction = (payload: ILoginData): IAction => {
    return {
        type: SagaTasks.POST_LOGIN,
        payload,
    };
};

export const loginUserAction = (payload: any): IAction => {
    return {
        type: ReduxAuthActions.LOGIN_USER,
        payload,
    };
};

export const annualizeLoginResponse = (): Action<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.ANNUALIZE_LOGIN_RESPONSE,
    };
};

export const postSignupAction = (payload: ISignupData): IAction => {
    return {
        type: SagaTasks.POST_SIGNUP,
    };
};

export const signupUserAction = (payload: any): IAction => {
    return {
        type: ReduxAuthActions.SIGNUP_USER,
        payload,
    };
};

export const annualizeSignupResponse = (): Action<ReduxAuthActions> => {
    return {
        type: ReduxAuthActions.ANNUALIZE_SIGNUP_RESPONSE,
    };
};
