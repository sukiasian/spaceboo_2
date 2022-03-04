import { ReduxImageActions, IServerResponse } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IImageState {
    postUploadUserAvatarSuccessResponse?: IServerResponse;
    postUploadUserAvatarFailureResponse?: IServerResponse;
    deleteUserAvatarSuccessResponse?: IServerResponse;
    deleteUserAvatarFailureResponse?: IServerResponse;
}

const initialState: IImageState = {};

export const imageReducer = (state = initialState, action: IAction<ReduxImageActions>): IImageState => {
    switch (action.type) {
        case ReduxImageActions.SET_POST_UPLOAD_USER_AVATAR_SUCCESS_RESPONSE:
            return {
                ...state,
                postUploadUserAvatarSuccessResponse: action.payload,
            };

        case ReduxImageActions.SET_POST_UPLOAD_USER_AVATAR_FAILURE_RESPONSE:
            return {
                ...state,
                postUploadUserAvatarFailureResponse: action.payload,
            };

        case ReduxImageActions.ANNUALIZE_POST_UPLOAD_USER_AVATAR_RESPONSES:
            return {
                ...state,
                postUploadUserAvatarSuccessResponse: undefined,
                postUploadUserAvatarFailureResponse: undefined,
            };

        case ReduxImageActions.SET_DELETE_USER_AVATAR_SUCCESS_RESPONSE:
            return {
                ...state,
                deleteUserAvatarSuccessResponse: action.payload,
            };

        case ReduxImageActions.SET_DELETE_USER_AVATAR_FAILURE_RESPONSE:
            return {
                ...state,
                deleteUserAvatarFailureResponse: action.payload,
            };

        case ReduxImageActions.ANNUALIZE_DELETE_USER_AVATAR_RESPONSES:
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
