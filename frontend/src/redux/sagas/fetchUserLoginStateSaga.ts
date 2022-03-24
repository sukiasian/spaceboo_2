import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrl, IServerResponse, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import {
    setFetchUserLoginStateFailureResponseAction,
    setFetchUserLoginStateSuccessResponseAction,
} from '../actions/authActions';

const fetchUserLoginState = async (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrl.AUTH}/userLoginState`);
};

function* fetchUserLoginStateWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchUserLoginState);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(
                setFetchUserLoginStateSuccessResponseAction({ ...(response as IServerResponse), isLoaded: true })
            );
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchUserLoginStateFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchUserLoginState(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.FETCH_USER_LOGIN_STATE, fetchUserLoginStateWorker); // слушает action-ы
}
