import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrls, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setDeleteUserAvatarFailureResponse, setDeleteUserAvatarSuccessResponse } from '../actions/imageActions';

const deleteUserAvatar = (): Promise<IServerResponse> => {
    return httpRequester.delete(`${ApiUrls.IMAGES}/user`);
};

function* deleteUserAvatarWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(deleteUserAvatar);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setDeleteUserAvatarSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setDeleteUserAvatarFailureResponse(err as IServerResponse));
    }
}
export function* watchDeleteUserAvatar(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.DELETE_USER_AVATAR, deleteUserAvatarWorker);
}
