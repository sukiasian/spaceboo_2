import { IServerResponse, ReduxImageActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export interface TPostUploadSpaceImagesPayload {
    spaceId: string;
    images: FileList;
}

export const postUploadSpaceImagesAction = (
    payload: TPostUploadSpaceImagesPayload
): IAction<SagaTasks, TPostUploadSpaceImagesPayload> => {
    return {
        type: SagaTasks.POST_UPLOAD_SPACE_IMAGES,
        payload,
    };
};

export const setUploadImageSuccessResponseAction = (payload: IServerResponse): IAction<ReduxImageActions> => {
    return {
        type: ReduxImageActions.SET_UPLOAD_IMAGES_SUCCESS_RESPONSE,
        payload,
    };
};

export const setUploadImageFailureResponseAction = (payload: IServerResponse): IAction<ReduxImageActions> => {
    return {
        type: ReduxImageActions.SET_UPLOAD_IMAGES_FAILURE_RESPONSE,
        payload,
    };
};
