import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setPostUnlockLockerFailureResponseAction,
    setPostUnlockLockerSuccessResponseAction,
} from '../actions/lockerApiActions';
import { IUnlockLockerPayload } from '../reducers/lockerApiReducer';

const postUnlockLocker = (payload: IUnlockLockerPayload): Promise<IServerResponse> => {
    return httpRequester.post(ApiUrl.LOCKER_API_UNLOCK, payload);
};

function* postUnlockLockerWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postUnlockLocker, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostUnlockLockerSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostUnlockLockerFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostUnlockLocker(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.POST_UNLOCK_LOCKER, postUnlockLockerWorker);
}
