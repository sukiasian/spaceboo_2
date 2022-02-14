import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ISignupData } from '../../forms/SignupForm';
import { IServerResponse, ApiUrls, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setPostSignupUserSuccessResponse, setPostSignupUserFailureResponse } from '../actions/authActions';

const signupUser = async (signupData: ISignupData): Promise<IServerResponse> => {
    return httpRequester.post(`${ApiUrls.AUTH}/signup`, signupData);
};

function* signupWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(signupUser, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostSignupUserSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostSignupUserFailureResponse(err as IServerResponse));
    }
}

export function* watchPostSignup(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.REQUEST_SIGNUP_USER, signupWorker);
}
