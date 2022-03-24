import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import {
    setFetchCurrentUserSuccessResponseAction,
    setFetchCurrentUserFailureResponseAction,
} from '../actions/userActions';

const fetchCurrentUser = (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrl.USERS}/current`);
};

function* fetchCurrentUserWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchCurrentUser);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchCurrentUserSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchCurrentUserFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchCurrentUser(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.FETCH_CURRENT_USER, fetchCurrentUserWorker);
}
