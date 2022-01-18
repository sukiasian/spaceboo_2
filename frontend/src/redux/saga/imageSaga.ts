import { CallEffect, PutEffect, ForkEffect, takeEvery, put, call } from '@redux-saga/core/effects';
import { ApiUrls, IServerSuccessResponse, ReduxImageActions, SagaTasks, TServerResponse } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { IAction } from '../actions/ActionTypes';
import {
    setUploadImageFailureResponseAction,
    setUploadImageSuccessResponseAction,
    TPostUploadSpaceImagesPayload,
} from '../actions/imageActions';

const postSpaceImages = ({ spaceId, images }: TPostUploadSpaceImagesPayload): Promise<TServerResponse> => {
    const headers: HeadersInit = {
        'Content-Type': 'multipart/form-data',
    };

    // откуда нам брать spaceId ? нужно ответ createSpace и editSpace запихнуть в redux storage,
    // и из него уже передавать в saga task.

    // TODO нам нужно понять как будет называться массив изобр. и сделать наши images значением данного проперти
    return httpRequester.post(`${ApiUrls.IMAGES}/spaces/${spaceId}`, { body: images }, headers);
};
const abc = () => {
    return httpRequester.get(`${ApiUrls.IMAGES}/hello`);
};

function* postSpaceImagesWorker(action: IAction<SagaTasks, TPostUploadSpaceImagesPayload>): Generator {
    try {
        // const response = yield call(postSpaceImages, action.payload as TPostUploadSpaceImagesPayload);
        const response = yield call(abc);
        console.log(response);

        // FIXME эта ошибка возникает потому что в IServerSuccessResponse есть проперти statusCode а в IServerFailureResponse нету
        // if (response.statusCode >= 200 && response.statusCode < 400) {
        //     yield put(setUploadImageSuccessResponseAction(response as IServerSuccessResponse));
        // } else {
        //     throw response;
        // }
    } catch (err) {
        // yield put(setUploadImageFailureResponseAction(err as IServerFailureResponse));
    }
}
export function* watchPostUploadSpaceImages(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.POST_UPLOAD_SPACE_IMAGES, postSpaceImagesWorker);
}
