import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import {
    setFetchSpacesForKeyControlFailureResponseAction,
    setFetchSpacesForKeyControlSuccessResponseAction,
} from '../actions/spaceActions';

const fetchSpacesForKeyControl = (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrl.SPACES}/appointed/keyControl`);
};

function* fetchSpacesForKeyControlWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchSpacesForKeyControl);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchSpacesForKeyControlSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchSpacesForKeyControlFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchSpacesForKeyControl(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.FETCH_SPACES_FOR_KEY_CONTROL, fetchSpacesForKeyControlWorker);
}
