import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask, QueryDefaultValue } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setFetchLockersByQueryFailureResponse, setFetchLockersByQuerySuccessResponse } from '../actions/adminActions';
import { ILockerRequestsQueryString } from '../reducers/adminReducer';

const fetchLockersByQuery = (query: ILockerRequestsQueryString): Promise<IServerResponse> => {
    return httpRequester.get(
        `${ApiUrl.LOCKERS}?page=${query.page || QueryDefaultValue.PAGE}&limit=${query.limit || QueryDefaultValue.LIMIT}`
    );
};

function* fetchLockersByQueryWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchLockersByQuery, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchLockersByQuerySuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchLockersByQueryFailureResponse(err as IServerResponse));
    }
}
export function* watchFetchLockersByQuery(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.FETCH_LOCKERS_BY_QUERY, fetchLockersByQueryWorker);
}
