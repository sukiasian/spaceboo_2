import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ILoginData } from '../../forms/LoginForm';
import { ApiUrls, HttpStatus, IServerResponse, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { IAction } from '../actions/ActionTypes';
import { setPostLoginSuccessResponseAction, setPostLoginFailureResponseAction } from '../actions/authActions';

const loginUser = async (loginData: ILoginData): Promise<IServerResponse> => {
    return httpRequester.post(`${ApiUrls.AUTH}/login`, loginData);
};

function* loginWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(loginUser, action.payload);

        if (
            (response as IServerResponse).statusCode >= HttpStatus.OK &&
            (response as IServerResponse).statusCode < HttpStatus.AMBIGUOUS
        ) {
            yield put(setPostLoginSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostLoginFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostLogin(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.POST_LOGIN_USER, loginWorker);
}
