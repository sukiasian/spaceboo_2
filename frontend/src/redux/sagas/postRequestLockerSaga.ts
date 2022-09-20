import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setPostLockerRequestFailureResponseAction,
    setPostLockerRequestSuccessResponseAction,
} from '../actions/lockerRequestsActions';
import { IRequestLockerConnectionPayload } from '../reducers/lockerRequestsReducer';

const postRequestLocker = (payload: IRequestLockerConnectionPayload): Promise<IServerResponse> => {
    return httpRequester.post(ApiUrl.LOCKER_REQUESTS_CONNECTION, payload);
};

function* postRequestLockerWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postRequestLocker, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostLockerRequestSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostLockerRequestFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostRequestLocker(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.POST_CREATE_LOCKER_REQUEST, postRequestLockerWorker);
}
