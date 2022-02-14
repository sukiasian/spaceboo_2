import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrls, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import {
    setFetchCurrentUserSuccessResponseAction,
    setFetchCurrentUserFailureResponseAction,
} from '../actions/userActions';

const fetchCurrentUser = (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrls.USERS}/current`);
};

function* fetchCurrentUserWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchCurrentUser);

        if ((response as IServerResponse).statusCode >= 200 && (response as IServerResponse).statusCode < 300) {
            yield put(setFetchCurrentUserSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchCurrentUserFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchCurrentUser(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_CURRENT_USER, fetchCurrentUserWorker);
}
