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

const deleteUnpairLocker = (payload: IDeleteLockerPayload): Promise<IServerResponse> => {
    return httpRequester.delete(`${ApiUrl.LOCKERS}?spaceId=${payload.spaceId}`);
};

function* deleteUnpairLockerWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(deleteUnpairLocker, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostUnpairLockerSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostUnpairLockerFailureResponseAction(err as IServerResponse));
    }
}
export function* watchDeleteUnpairLocker(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.DELETE_UNPAIR_LOCKER, deleteUnpairLockerWorker);
}
