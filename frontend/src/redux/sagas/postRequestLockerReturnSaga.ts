import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setPostLockerReturnRequestFailureResponseAction,
    setPostLockerReturnRequestSuccessResponseAction,
} from '../actions/lockerRequestsActions';
import { IRequestReturnLockerPayload } from '../reducers/lockerRequestsReducer';

const postRequestLockerReturn = (payload: IRequestReturnLockerPayload): Promise<IServerResponse> => {
    return httpRequester.post(`${ApiUrl.LOCKER_REQUESTS}/${payload.lockerId}`, payload);
};

function* postRequestLockerReturnWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postRequestLockerReturn, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostLockerReturnRequestSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostLockerReturnRequestFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostRequestLockerReturn(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.POST_CREATE_LOCKER_RETURN_REQUEST, postRequestLockerReturnWorker);
}
