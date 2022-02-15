import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrls, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import {
    setFetchLogoutUserSuccessResponseAction,
    setFetchLogoutUserFailureResponseAction,
} from '../actions/authActions';

const postLogoutUser = async (): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrls.AUTH}/logout`);
};

function* postLogoutWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postLogoutUser);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchLogoutUserSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchLogoutUserFailureResponseAction(err as IServerResponse));
    }
}

export function* watchPostLogoutUser(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.POST_LOGOUT_USER, postLogoutWorker);
}
