import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrl, IServerResponse, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setPostUploadUserAvatarFailureResponseAction,
    setPostUploadUserAvatarSuccessResponseAction,
} from '../actions/imageActions';

const postUploadUserAvatar = async (userAvatar: File): Promise<IServerResponse> => {
    const formDataParsed = new FormData();

    formDataParsed.append('userAvatar', userAvatar);

    return httpRequester.postMultipartFormData(`${ApiUrl.IMAGES}/user`, formDataParsed);
};

function* postUploadUserAvatarWorker(
    action: IAction<SagaTask, File>
): Generator<CallEffect | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postUploadUserAvatar, action.payload!);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPostUploadUserAvatarSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPostUploadUserAvatarFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostUploadUserAvatar(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTask.POST_UPLOAD_USER_AVATAR, postUploadUserAvatarWorker);
}