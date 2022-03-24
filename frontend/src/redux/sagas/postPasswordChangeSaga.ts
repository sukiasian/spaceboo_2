import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IPasswordChangeFormData } from '../../forms/PasswordChangeForm';
import { ApiUrl, IServerResponse, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setPostPasswordChangeSuccessResponseAction,
    setPostPasswordChangeFailureResponseAction,
} from '../actions/authActions';

const postPasswordChange = async (passwordChangeData: IPasswordChangeFormData): Promise<IServerResponse> => {
    return httpRequester.put(`${ApiUrl.AUTH}/passwordChange`, { passwordData: passwordChangeData });
};

function* postPasswordChangeWorker(action: IAction<SagaTask>): Generator<CallEffect | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postPasswordChange, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostPasswordChangeSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostPasswordChangeFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostPasswordChange(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTask.POST_PASSWORD_CHANGE, postPasswordChangeWorker);
}
