import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setPostUnpairLockerFailureResponseAction,
    setPostUnpairLockerSuccessResponseAction,
} from '../actions/adminActions';
import { IDeleteLockerPayload } from '../reducers/adminReducer';

const postUnpairLocker = (payload: IDeleteLockerPayload): Promise<IServerResponse> => {
    return httpRequester.delete(`${ApiUrl.LOCKERS}?spaceId=${payload.spaceId}`);
};

function* postUnpairLockerWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postUnpairLocker, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostUnpairLockerSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostUnpairLockerFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostUnpairLocker(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.POST_UNPAIR_LOCKER, postUnpairLockerWorker);
}
