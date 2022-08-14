import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setFetchAppointmentsForMonthFailureResponseAction,
    setFetchAppointmentsForMonthSuccessResponseAction,
} from '../actions/appointmentActions';
import {} from '../actions/spaceActions';
import { IFetchAppointmentsForMonthPayload } from '../reducers/spaceReducer';

const fetchAppointmentsForMonth = ({
    spaceId,
    requiredDates,
}: IFetchAppointmentsForMonthPayload): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrl.APPOINTMENTS}?spaceId=${spaceId}&requiredDates=${requiredDates}`);
};

function* fetchAppointmentsForMonthWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchAppointmentsForMonth, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchAppointmentsForMonthSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchAppointmentsForMonthFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchAppointmentsForMonthWorker(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.FETCH_APPOINTMENTS_FOR_MONTH, fetchAppointmentsForMonthWorker);
}
