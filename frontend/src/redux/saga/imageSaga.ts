import { ForkEffect, takeEvery, put, call } from '@redux-saga/core/effects';
import { ApiUrls, IServerResponse, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { IAction } from '../actions/ActionTypes';
import {
    setUploadImageFailureResponseAction,
    setUploadImageSuccessResponseAction,
    TPostUploadSpaceImagesPayload,
} from '../actions/imageActions';

const postSpaceImages = ({ spaceId, images }: TPostUploadSpaceImagesPayload): Promise<IServerResponse> => {
    const headers: HeadersInit = {
        'Content-Type': 'multipart/form-data',
    };

    return httpRequester.post(`${ApiUrls.IMAGES}/spaces/${spaceId}`, { body: images }, headers);
};

function* postSpaceImagesWorker(action: IAction<SagaTasks, TPostUploadSpaceImagesPayload>): Generator {
    try {
        const response = yield call(postSpaceImages, action.payload as TPostUploadSpaceImagesPayload);

        console.log(response);

        if ((response as IServerResponse).statusCode >= 200 && (response as IServerResponse).statusCode < 400) {
            yield put(setUploadImageSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setUploadImageFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostUploadSpaceImages(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.POST_UPLOAD_SPACE_IMAGES, postSpaceImagesWorker);
}
