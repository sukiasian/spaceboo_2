import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import {
    setFetchUserSpacesSuccessResponseAction,
    setFetchUserSpacesFailureResponseAction,
} from '../actions/spaceActions';

const fetchUserSpaces = (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrl.SPACES}/user`);
};

function* fetchUserSpacesWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchUserSpaces);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchUserSpacesSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchUserSpacesFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchUserSpaces(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.FETCH_USER_SPACES, fetchUserSpacesWorker);
}
