import { CallEffect, PutEffect, ForkEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrls, ReduxEmailVerificationActions, IServerResponse, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setPostCheckVerificationCodeSuccessResponse,
    setPostCheckVerificationCodeFailureResponse,
} from '../actions/emailVerificationActions';
import { IPostCheckVerificationEmailCodePayload } from '../reducers/emailVerificationReducer';

const postCheckVerificationEmail = async ({
    currentCode,
    email,
    recovery,
    confirmation,
}: IPostCheckVerificationEmailCodePayload): Promise<object> => {
    return httpRequester.post(ApiUrls.EMAIL_VERIFICATION, {
        currentCode,
        email,
        recovery,
        confirmation,
    });
};

function* postCheckVerificationCodeWorker(
    action: IAction<ReduxEmailVerificationActions, IPostCheckVerificationEmailCodePayload>
): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postCheckVerificationEmail, action.payload!);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostCheckVerificationCodeSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostCheckVerificationCodeFailureResponse(err as IServerResponse));
    }
}
export function* watchPostCheckVerificationCode(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.POST_CHECK_VERIFICATION_CODE, postCheckVerificationCodeWorker);
}
