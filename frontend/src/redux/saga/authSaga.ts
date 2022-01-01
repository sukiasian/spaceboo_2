import { call, put, takeEvery, takeLatest, StrictEffect, PutEffect, ForkEffect } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, ReduxAuthActions, SagaTasks } from '../../types/types';
import { IAction } from '../actions/ActionTypes';
import { loginUserAction, logoutUserAction, signupUserAction } from '../actions/authActions';
import { ILoginData } from '../../forms/LoginForm';
import { ISignupData } from '../../forms/SignupForm';

const fetchIsLoggedIn = async (): Promise<object> => {
    return (await httpRequester.get(`${ApiUrls.AUTH}/userLoginState`)).data;
};

function* authWorker(): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(fetchIsLoggedIn);

    yield put({ type: ReduxAuthActions.FETCH_USER_IS_LOGGED_IN, payload }); // чтобы обратиться к reducer-у
}

export function* watchAuth(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_USER_LOGIN_STATE, authWorker); // слушает action-ы
}

const loginUser = async (loginData: ILoginData): Promise<object> => {
    return httpRequester.post(`${ApiUrls.AUTH}/login`, loginData);
};

function* loginWorker(action: IAction): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(loginUser, action.payload);

    yield put(loginUserAction(payload));
}

export function* watchPostLogin(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.POST_LOGIN, loginWorker);
}

const signupUser = async (signupData: ISignupData): Promise<object> => {
    return httpRequester.post(`${ApiUrls.AUTH}/signup`, signupData);
};

function* signupWorker(action: IAction): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(signupUser, action.payload);

    yield put(signupUserAction(payload));
}

export function* watchPostSignup(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.POST_SIGNUP, signupWorker);
}

const logoutUser = async (): Promise<void> => {
    return httpRequester.get(`${ApiUrls.AUTH}/logout`);
};

function* logoutWorker(): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(logoutUser);

    yield put(logoutUserAction(payload));
}

export function* watchLogoutUser(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.REQUEST_USER_LOGOUT, logoutWorker);
}

// const confirmAccount = async (): Promise<void> => {
//     return httpRequester.post(`${ApiUrls.AUTH}/logout`, {});
// };

// function* confirmAccountWorker(): Generator<StrictEffect, void, PutEffect> {
//     const payload = yield call(logoutUser);

//     yield put(logoutUserAction(payload));
// }

// export function* watchConfirmAccount(): Generator<ForkEffect, void, void> {
//     yield takeLatest(SagaTasks.REQUEST_USER_LOGOUT, logoutWorker);
// }
