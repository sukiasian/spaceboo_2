import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask, QueryDefaultValue } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setFetchLockerRequestsByQueryFailureResponseAction,
    setFetchLockerRequestsByQuerySuccessResponseAction,
} from '../actions/adminActions';
import { IRequestQueryString } from '../reducers/lockerRequestsReducer';

const fetchLockerRequestsByQuery = (query: IRequestQueryString): Promise<IServerResponse> => {
    return httpRequester.get(
        `${ApiUrl.LOCKER_REQUESTS}?page=${query.page || QueryDefaultValue.PAGE}&limit=${
            query.limit || QueryDefaultValue.LIMIT
        }&type=${query.type || ''}`
    );
};

function* fetchLockerRequestsByQueryWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchLockerRequestsByQuery, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchLockerRequestsByQuerySuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchLockerRequestsByQueryFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchLockerRequestsByQueryWorker(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.FETCH_LOCKER_REQUESTS_BY_QUERY, fetchLockerRequestsByQueryWorker);
}
