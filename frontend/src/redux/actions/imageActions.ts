import { IServerResponse, ReduxImageAction, SagaTask } from '../../types/types';
import { IAction } from './ActionTypes';

export const postUploadUserAvatarAction = (payload: File): IAction<SagaTask, File> => {
    return {
        type: SagaTask.POST_UPLOAD_USER_AVATAR,
        payload,
    };
};

export const deleteUserAvatarAction = (): IAction<SagaTask> => {
    return {
        type: SagaTask.DELETE_USER_AVATAR,
    };
};

export const setPostUploadUserAvatarSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxImageAction, IServerResponse> => {
    return {
        type: ReduxImageAction.SET_POST_UPLOAD_USER_AVATAR_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostUploadUserAvatarFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxImageAction, IServerResponse> => {
    return {
        type: ReduxImageAction.SET_POST_UPLOAD_USER_AVATAR_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizePostUploadUserAvatarResponsesAction = (): IAction<ReduxImageAction> => {
    return {
        type: ReduxImageAction.ANNUALIZE_POST_UPLOAD_USER_AVATAR_RESPONSES,
    };
};

export const setDeleteUserAvatarSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxImageAction, IServerResponse> => {
    return {
        type: ReduxImageAction.SET_DELETE_USER_AVATAR_SUCCESS_RESPONSE,
        payload,
    };
};

export const setDeleteUserAvatarFailureResponse = (
    payload: IServerResponse
): IAction<ReduxImageAction, IServerResponse> => {
    return {
        type: ReduxImageAction.SET_DELETE_USER_AVATAR_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizeDeleteUserAvatarResponsesAction = (): IAction<ReduxImageAction> => {
    return {
        type: ReduxImageAction.ANNUALIZE_DELETE_USER_AVATAR_RESPONSES,
    };
};
