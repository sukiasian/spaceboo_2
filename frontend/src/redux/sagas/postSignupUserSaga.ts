import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ISignupData } from '../../forms/SignupForm';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setPostSignupUserSuccessResponseAction, setPostSignupUserFailureResponseAction } from '../actions/authActions';

const signupUser = async (signupData: ISignupData): Promise<IServerResponse> => {
    return httpRequester.post(`${ApiUrl.AUTH}/signup`, signupData);
};

function* signupWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(signupUser, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostSignupUserSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostSignupUserFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostSignup(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTask.POST_SIGNUP_USER, signupWorker);
}
