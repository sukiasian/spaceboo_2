import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrl, IServerResponse, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import {
    setFetchSpacesByUserOutdatedAppointmentsFailureResponseAction,
    setFetchSpacesByUserOutdatedAppointmentsSuccessResponseAction,
} from '../actions/spaceActions';

const fetchOutdatedUserAppointments = async (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrl.SPACES}/appointed/outdated`);
};

function* fetchUserOutdatedAppointmentsWorker(): Generator<CallEffect | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchOutdatedUserAppointments);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchSpacesByUserOutdatedAppointmentsSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchSpacesByUserOutdatedAppointmentsFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchUserOutdatedAppointments(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTask.FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS, fetchUserOutdatedAppointmentsWorker);
}
