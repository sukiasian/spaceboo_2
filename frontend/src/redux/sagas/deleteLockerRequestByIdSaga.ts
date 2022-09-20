import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setDeleteLockerRequestByIdSuccessResponseAction,
    setDeleteLockerRequestByIdFailureResponseAction,
} from '../actions/lockerRequestsActions';
import { IDeleteLockerRequestPayload } from '../reducers/adminReducer';

const deleteLockerRequestById = ({ requestId }: IDeleteLockerRequestPayload): Promise<IServerResponse> => {
    return httpRequester.delete(`${ApiUrl.LOCKER_REQUESTS}/${requestId}`);
};

function* deleteLockerRequestByIdWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(deleteLockerRequestById, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setDeleteLockerRequestByIdSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setDeleteLockerRequestByIdFailureResponseAction(err as IServerResponse));
    }
}
export function* watchDeleteLockerRequestById(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.DELETE_LOCKER_REQUEST_BY_ID, deleteLockerRequestByIdWorker);
}
