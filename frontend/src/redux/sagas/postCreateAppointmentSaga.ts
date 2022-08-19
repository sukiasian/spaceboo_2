import { AnyAction } from 'redux';
import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { ApiUrl, HttpStatus, IServerResponse, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { IAction } from '../actions/ActionTypes';
import { setPostLoginSuccessResponseAction, setPostLoginFailureResponseAction } from '../actions/authActions';
import { ICreateAppointmentPayload } from '../reducers/appointmentReducer';

const createAppointment = async (createAppointmentData: ICreateAppointmentPayload): Promise<IServerResponse> => {
    return httpRequester.post(ApiUrl.APPOINTMENTS, createAppointmentData);
};

function* createAppointmentWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(createAppointment, action.payload);

        if (
            (response as IServerResponse).statusCode >= HttpStatus.OK &&
            (response as IServerResponse).statusCode < HttpStatus.AMBIGUOUS
        ) {
            yield put(setPostLoginSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostLoginFailureResponseAction(err as IServerResponse));
    }
}
export function* watchCreateAppointment(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTask.POST_CREATE_APPOINTMENT, createAppointmentWorker);
}
