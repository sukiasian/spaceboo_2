import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrl, IServerResponse, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import {
    setFetchSpacesByUserUpcomingAppointmentsFailureResponseAction,
    setFetchSpacesByUserUpcomingAppointmentsSuccessResponseAction,
} from '../actions/spaceActions';

const fetchUpcomingUserAppointments = async (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrl.SPACES}/appointed/upcoming`);
};

function* fetchUserUpcomingAppointmentsWorker(): Generator<CallEffect | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchUpcomingUserAppointments);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchSpacesByUserUpcomingAppointmentsSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchSpacesByUserUpcomingAppointmentsFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchUserUpcomingAppointments(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTask.FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS, fetchUserUpcomingAppointmentsWorker);
}
