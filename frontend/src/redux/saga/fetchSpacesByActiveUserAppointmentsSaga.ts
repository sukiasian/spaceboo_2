import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrls, IServerResponse, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import {
    setFetchSpacesByUserActiveAppointmentsFailureResponse,
    setFetchSpacesByUserActiveAppointmentsSuccessResponse,
} from '../actions/spaceActions';

const fetchActiveUserAppointments = async (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrls.SPACES}/appointed/active`);
};

function* fetchUserActiveAppointmentsWorker(): Generator<CallEffect | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchActiveUserAppointments);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchSpacesByUserActiveAppointmentsSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchSpacesByUserActiveAppointmentsFailureResponse(err as IServerResponse));
    }
}
export function* watchFetchUserActiveAppointments(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS, fetchUserActiveAppointmentsWorker);
}
