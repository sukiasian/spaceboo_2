import { call, put, takeEvery, StrictEffect, PutEffect, ForkEffect } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, ReduxAuthActions, SagaTasks } from '../../types/types';
import { IAction } from '../actions/ActionTypes';
import { loginUserAction, signupUserAction } from '../actions/authActions';
import { ILoginData } from '../../components/LoginForm';
import { ISignupData } from '../../components/SignupForm';

const fetchIsLoggedIn = async (): Promise<object> => {
    return (await httpRequester.get(`${ApiUrls.AUTH}/userIsLoggedIn`)).data;
};

function* authWorker(): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(fetchIsLoggedIn);

    yield put({ type: ReduxAuthActions.FETCH_USER_IS_LOGGED_IN, payload }); // чтобы обратиться к reducer-у
}

export function* watchAuth(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_USER_IS_LOGGED_IN, authWorker); // слушает action-ы
}

const loginUser = async (loginData: ILoginData): Promise<object> => {
    return httpRequester.post(`${ApiUrls.AUTH}/login`, loginData);
};

function* loginWorker(action: IAction): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(loginUser, action.payload);

    yield put(loginUserAction(payload));
}

export function* watchPostLogin(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.POST_LOGIN, loginWorker);
}

const signupUser = async (signupData: ISignupData): Promise<object> => {
    return httpRequester.post(`${ApiUrls.AUTH}/signup`, signupData);
};

function* signupWorker(action: IAction): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(signupUser, action.payload);

    yield put(signupUserAction(payload));
}

export function* watchPostSignup(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.POST_SIGNUP, signupWorker);
}
