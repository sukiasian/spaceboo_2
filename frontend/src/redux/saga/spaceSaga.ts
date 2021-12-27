import { call, put, takeEvery, StrictEffect, PutEffect, ForkEffect } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, ReduxSpaceActions, SagaTasks } from '../../types/types';

// TODO разобраться с типами ответов с бэкенда

const fetchSpaces = async (): Promise<Array<object>> => {
    return (await httpRequester.get(ApiUrls.SPACES)).data;
};

function* spaceWorker(): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(fetchSpaces);

    yield put({ type: ReduxSpaceActions.FETCH_SPACES, payload }); // чтобы обратиться к reducer-у
}

export function* watchSpaces(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_SPACES, spaceWorker); // слушает action-ы
}
