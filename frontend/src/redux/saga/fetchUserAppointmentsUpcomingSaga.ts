import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest, all, AllEffect } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrls, IServerResponse, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setFetchCitiesByPatternSuccessResponseAction,
    setFetchCitiesByPatternFailureResponseAction,
} from '../actions/cityActions';

const ƒetchUpcomingUserAppointments = async (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrls.APPOINTMENTS}/user/upcoming`);
};

function* ƒetchUserUpcomingAppointmentsWorker(
    action: IAction
): Generator<AllEffect<CallEffect> | PutEffect<AnyAction>, void> {
    try {
        const response = yield all([call(ƒetchUpcomingUserAppointments)]);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchCitiesByPatternSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchCitiesByPatternFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchUserUpcomingAppointments(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.FETCH_USER_UPCOMING_APPOINTMENTS, ƒetchUserUpcomingAppointmentsWorker);
}
