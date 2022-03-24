import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, ReduxEmailVerificationAction, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setPostSendVerificationCodeSuccessResponse,
    setPostSendVerificationCodeFailureResponse,
} from '../actions/emailVerificationActions';
import { IPostSendVerificationEmailPayload } from '../reducers/emailVerificationReducer';

const postSendVerificationCode = async ({
    purpose,
    email,
}: IPostSendVerificationEmailPayload): Promise<IServerResponse> => {
    return httpRequester.post(`${ApiUrl.EMAIL_VERIFICATION}/${purpose}`, {
        email,
    });
};

function* postSendVerificationCodeWorker(
    action: IAction<ReduxEmailVerificationAction, IPostSendVerificationEmailPayload>
): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postSendVerificationCode, action.payload!);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostSendVerificationCodeSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostSendVerificationCodeFailureResponse(err as IServerResponse));
    }
}
export function* watchPostSendVerificationCode(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.POST_SEND_VERIFICATION_CODE, postSendVerificationCodeWorker);
}
