import { IServerResponse, ReduxImageActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export const postUploadUserAvatarAction = (payload: File): IAction<SagaTasks, File> => {
    return {
        type: SagaTasks.POST_UPLOAD_USER_AVATAR,
        payload,
    };
};

export const deleteUserAvatarAction = (): IAction<SagaTasks> => {
    return {
        type: SagaTasks.DELETE_USER_AVATAR,
    };
};

export const setPostUploadUserAvatarSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxImageActions, IServerResponse> => {
    return {
        type: ReduxImageActions.SET_POST_UPLOAD_USER_AVATAR_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostUploadUserAvatarFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxImageActions, IServerResponse> => {
    return {
        type: ReduxImageActions.SET_POST_UPLOAD_USER_AVATAR_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizePostUploadUserAvatarResponsesAction = (): IAction<ReduxImageActions> => {
    return {
        type: ReduxImageActions.ANNUALIZE_POST_UPLOAD_USER_AVATAR_RESPONSES,
    };
};

export const setDeleteUserAvatarSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxImageActions, IServerResponse> => {
    return {
        type: ReduxImageActions.SET_DELETE_USER_AVATAR_SUCCESS_RESPONSE,
        payload,
    };
};

export const setDeleteUserAvatarFailureResponse = (
    payload: IServerResponse
): IAction<ReduxImageActions, IServerResponse> => {
    return {
        type: ReduxImageActions.SET_DELETE_USER_AVATAR_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizeDeleteUserAvatarResponsesAction = (): IAction<ReduxImageActions> => {
    return {
        type: ReduxImageActions.ANNUALIZE_DELETE_USER_AVATAR_RESPONSES,
    };
};
