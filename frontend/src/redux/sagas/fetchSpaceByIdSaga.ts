import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setFetchSpaceByIdSuccessResponseAction,
    setFetchSpaceByIdFailureResponseAction,
} from '../actions/spaceActions';

const fetchSpaceById = (spaceId: string): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrl.SPACES}/${spaceId}`);
};

function* fetchSpaceByIdWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchSpaceById, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchSpaceByIdSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchSpaceByIdFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchSpaceById(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.FETCH_SPACE_BY_ID, fetchSpaceByIdWorker);
}
