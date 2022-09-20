import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setPostPairLockerFailureResponseAction,
    setPostPairLockerSuccessResponseAction,
} from '../actions/adminActions';
import { ICreateLockerPayload } from '../reducers/adminReducer';

const postPairLocker = (payload: ICreateLockerPayload): Promise<IServerResponse> => {
    return httpRequester.post(ApiUrl.LOCKERS, payload);
};

function* postPairLockerWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postPairLocker, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostPairLockerSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostPairLockerFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostPairLocker(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.POST_PAIR_LOCKER, postPairLockerWorker);
}
