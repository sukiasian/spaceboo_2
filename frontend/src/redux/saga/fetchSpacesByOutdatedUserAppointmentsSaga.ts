import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest, all, AllEffect } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrls, IServerResponse, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import {
    setFetchSpacesByUserOutdatedAppointmentsFailureResponse,
    setFetchSpacesByUserOutdatedAppointmentsSuccessResponse,
} from '../actions/spaceActions';

const fetchOutdatedUserAppointments = async (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrls.SPACES}/appointed/outdated`);
};

function* fetchUserOutdatedAppointmentsWorker(): Generator<AllEffect<CallEffect> | PutEffect<AnyAction>, void> {
    try {
        const response = yield all([call(fetchOutdatedUserAppointments)]);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchSpacesByUserOutdatedAppointmentsSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchSpacesByUserOutdatedAppointmentsFailureResponse(err as IServerResponse));
    }
}
export function* watchFetchUserOutdatedAppointments(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS, fetchUserOutdatedAppointmentsWorker);
}
