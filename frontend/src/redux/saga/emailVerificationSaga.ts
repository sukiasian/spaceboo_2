import { call, put, takeEvery, StrictEffect, PutEffect, ForkEffect } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, ReduxEmailVerificationActions, SagaTasks } from '../../types/types';
import { IAction } from '../actions/ActionTypes';
import {
    IPostSendVerificationEmailPayload,
    IPostCheckVerificationEmailCodePayload,
} from '../reducers/emailVerificationReducer';

const sendVerificationCode = async ({ purpose, email }: IPostSendVerificationEmailPayload): Promise<object> => {
    return httpRequester.post(`${ApiUrls.EMAIL_VERIFICATION}/${purpose}`, {
        email,
    });
};

function* sendVerificationCodeWorker(
    action: IAction<ReduxEmailVerificationActions, IPostSendVerificationEmailPayload>
): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(sendVerificationCode, action.payload!);

    yield put({ type: ReduxEmailVerificationActions.SEND_VERIFICATION_CODE, payload });
}
export function* watchSendVerificationCode(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.POST_SEND_VERIFICATION_CODE, sendVerificationCodeWorker);
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
): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(checkVerificationEmail, action.payload!);

    yield put({ type: ReduxEmailVerificationActions.CHECK_VERIFICATION_CODE, payload });
}
export function* watchCheckVerificationCode(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.POST_CHECK_VERIFICATION_CODE, checkVerificationCodeWorker);
}
