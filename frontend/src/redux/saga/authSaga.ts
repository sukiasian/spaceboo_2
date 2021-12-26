import { call, put, takeEvery, StrictEffect, PutEffect, ForkEffect } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, ReduxAuthActions, SagaTasks } from '../../utils/types';

const fetchIsLoggedIn = (): Promise<object> => {
    return httpRequester.get(`${ApiUrls.AUTH}/userIsLoggedIn`);
};

function* authWorker(): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(fetchIsLoggedIn);

    yield put({ type: ReduxAuthActions.FETCH_USER_IS_LOGGED_IN, payload }); // чтобы обратиться к reducer-у
}

export function* watchAuth(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_USER_IS_LOGGED_IN, authWorker); // слушает action-ы
}
