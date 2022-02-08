import { CallEffect, StrictEffect, PutEffect, ForkEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, HttpStatus, IServerResponse, ReduxEmailVerificationActions, SagaTasks } from '../../types/types';
import { IAction } from '../actions/ActionTypes';
import {
    IPostSendVerificationEmailPayload,
    IPostCheckVerificationEmailCodePayload,
} from '../reducers/emailVerificationReducer';
import { AnyAction } from 'redux';
import {
    setPostCheckVerificationCodeFailureResponse,
    setPostCheckVerificationCodeSuccessResponse,
    setPostSendVerificationCodeFailureResponse,
    setPostSendVerificationCodeSuccessResponse,
} from '../actions/emailVerificationActions';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';

const sendVerificationCode = async ({
    purpose,
    email,
}: IPostSendVerificationEmailPayload): Promise<IServerResponse> => {
    return httpRequester.post(`${ApiUrls.EMAIL_VERIFICATION}/${purpose}`, {
        email,
    });
};

function* sendVerificationCodeWorker(
    action: IAction<ReduxEmailVerificationActions, IPostSendVerificationEmailPayload>
): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(sendVerificationCode, action.payload!);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostSendVerificationCodeSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostSendVerificationCodeFailureResponse(err as IServerResponse));
    }
}
export function* watchSendVerificationCode(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_SEND_VERIFICATION_CODE, sendVerificationCodeWorker);
}

const checkVerificationEmail = async ({
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

function* checkVerificationCodeWorker(
    action: IAction<ReduxEmailVerificationActions, IPostCheckVerificationEmailCodePayload>
): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(checkVerificationEmail, action.payload!);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostCheckVerificationCodeSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostCheckVerificationCodeFailureResponse(err as IServerResponse));
    }
}
export function* watchCheckVerificationCode(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_CHECK_VERIFICATION_CODE, checkVerificationCodeWorker);
}
