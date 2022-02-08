import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery, takeLatest } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, HttpStatus, IServerResponse, SagaTasks } from '../../types/types';
import { IAction } from '../actions/ActionTypes';
import {
    setFetchLogoutUserFailureResponseAction,
    setFetchLogoutUserSuccessResponseAction,
    setFetchUserLoginStateFailureResponseAction,
    setFetchUserLoginStateSuccessResponseAction,
    setPostLoginFailureResponseAction,
    setPostLoginSuccessResponseAction,
    setPostSignupUserFailureResponse,
    setPostSignupUserSuccessResponse,
} from '../actions/authActions';
import { ILoginData } from '../../forms/LoginForm';
import { ISignupData } from '../../forms/SignupForm';
import { AnyAction } from 'redux';

const fetchUserLoginState = async (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrls.AUTH}/userLoginState`);
};

function* fetchUserLoginStateWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchUserLoginState);

        if ((response as IServerResponse).statusCode >= 200 && (response as IServerResponse).statusCode < 300) {
            yield put(
                setFetchUserLoginStateSuccessResponseAction({ ...(response as IServerResponse), isLoaded: true })
            );
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchUserLoginStateFailureResponseAction(err as IServerResponse));
    }
}
export function* watchAfetchUserLoginState(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_USER_LOGIN_STATE, fetchUserLoginStateWorker); // слушает action-ы
}

const loginUser = async (loginData: ILoginData): Promise<IServerResponse> => {
    return httpRequester.post(`${ApiUrls.AUTH}/login`, loginData);
};

function* loginWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(loginUser, action.payload);

        if (
            (response as IServerResponse).statusCode >= HttpStatus.OK &&
            (response as IServerResponse).statusCode < HttpStatus.AMBIGUOUS
        ) {
            yield put(setPostLoginSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostLoginFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostLogin(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.REQUEST_LOGIN_USER, loginWorker);
}

const signupUser = async (signupData: ISignupData): Promise<IServerResponse> => {
    return httpRequester.post(`${ApiUrls.AUTH}/signup`, signupData);
};

function* signupWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(signupUser, action.payload);

        if (
            (response as IServerResponse).statusCode >= HttpStatus.OK &&
            (response as IServerResponse).statusCode < HttpStatus.AMBIGUOUS
        ) {
            yield put(setPostSignupUserSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostSignupUserFailureResponse(err as IServerResponse));
    }
}

export function* watchPostSignup(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.REQUEST_SIGNUP_USER, signupWorker);
}

const logoutUser = async (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrls.AUTH}/logout`);
};

function* logoutWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(logoutUser);

        if (
            (response as IServerResponse).statusCode >= HttpStatus.OK &&
            (response as IServerResponse).statusCode < HttpStatus.AMBIGUOUS
        ) {
            yield put(setFetchLogoutUserSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchLogoutUserFailureResponseAction(err as IServerResponse));
    }
}

export function* watchLogoutUser(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.REQUEST_LOGOUT_USER, logoutWorker);
}
