import { ReduxImageAction, IServerResponse } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IImageState {
    postUploadUserAvatarSuccessResponse?: IServerResponse;
    postUploadUserAvatarFailureResponse?: IServerResponse;
    deleteUserAvatarSuccessResponse?: IServerResponse;
    deleteUserAvatarFailureResponse?: IServerResponse;
}

const initialState: IImageState = {};

export const imageReducer = (state = initialState, action: IAction<ReduxImageAction>): IImageState => {
    switch (action.type) {
        case ReduxImageAction.SET_POST_UPLOAD_USER_AVATAR_SUCCESS_RESPONSE:
            return {
                ...state,
                postUploadUserAvatarSuccessResponse: action.payload,
            };

        case ReduxImageAction.SET_POST_UPLOAD_USER_AVATAR_FAILURE_RESPONSE:
            return {
                ...state,
                postUploadUserAvatarFailureResponse: action.payload,
            };

        case ReduxImageAction.ANNUALIZE_POST_UPLOAD_USER_AVATAR_RESPONSES:
            return {
                ...state,
                postUploadUserAvatarSuccessResponse: undefined,
                postUploadUserAvatarFailureResponse: undefined,
            };

        case ReduxImageAction.SET_DELETE_USER_AVATAR_SUCCESS_RESPONSE:
            return {
                ...state,
                deleteUserAvatarSuccessResponse: action.payload,
            };

        case ReduxImageAction.SET_DELETE_USER_AVATAR_FAILURE_RESPONSE:
            return {
                ...state,
                deleteUserAvatarFailureResponse: action.payload,
            };

        case ReduxImageAction.ANNUALIZE_DELETE_USER_AVATAR_RESPONSES:
            return {
                ...state,
                deleteUserAvatarSuccessResponse: undefined,
                deleteUserAvatarFailureResponse: undefined,
            };

        default:
            return {
                ...state,
            };
    }
};
