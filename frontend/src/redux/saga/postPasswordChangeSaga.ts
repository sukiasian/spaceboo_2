import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IPasswordChangeFormData } from '../../forms/PasswordChangeForm';
import { ApiUrls, IServerResponse, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setPostPasswordChangeFailureResponse, setPostPasswordChangeSuccessResponse } from '../actions/authActions';

const postPasswordChange = async (passwordChangeData: IPasswordChangeFormData): Promise<IServerResponse> => {
    return httpRequester.put(`${ApiUrls.AUTH}/passwordChange`, { passwordData: passwordChangeData });
};

function* postPasswordChangeWorker(action: IAction<SagaTasks>): Generator<CallEffect | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postPasswordChange, action.payload);
        console.log(response);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostPasswordChangeSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostPasswordChangeFailureResponse(err as IServerResponse));
    }
}
export function* watchPostPasswordChange(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.POST_PASSWORD_CHANGE, postPasswordChangeWorker);
}
