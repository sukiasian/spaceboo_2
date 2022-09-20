import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setFetchUnprocessedRequestsAmountSuccessResponseAction,
    setFetchUnprocessRequestsAmountFailureResponseAction,
} from '../actions/adminActions';

const fetchUnprocessedRequestsAmount = (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrl.LOCKER_REQUESTS}/amount`);
};

function* fetchUnprocessedRequestsAmountWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchUnprocessedRequestsAmount);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchUnprocessedRequestsAmountSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchUnprocessRequestsAmountFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchUnprocessedRequestsAmount(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.FETCH_UNPROCESSED_LOCKER_REQUESTS_AMOUNT, fetchUnprocessedRequestsAmountWorker);
}
