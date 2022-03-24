import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { setDeleteUserAvatarFailureResponse, setDeleteUserAvatarSuccessResponse } from '../actions/imageActions';

const deleteCancelAppointment = (): Promise<IServerResponse> => {
    return httpRequester.delete(ApiUrl.APPOINTMENTS);
};

function* deleteCancelAppointmentWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(deleteCancelAppointment);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setDeleteUserAvatarSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setDeleteUserAvatarFailureResponse(err as IServerResponse));
    }
}
export function* watchDeleteCancelAppointment(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.DELETE_CANCEL_APPOINTMENT, deleteCancelAppointmentWorker);
}
