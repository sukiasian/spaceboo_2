import { ReduxImageActions, IServerResponse } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

type TImagePayloads = IServerResponse;

interface IInitialState {
    uploadImagesSuccessResponse?: IServerResponse;
    uploadImagesFailureResponse?: IServerResponse;
}

const initialState: IInitialState = {};

export const imageReducer = (
    state = initialState,
    action: IAction<ReduxImageActions, TImagePayloads>
): IInitialState => {
    switch (action.type) {
        case ReduxImageActions.SET_UPLOAD_IMAGES_SUCCESS_RESPONSE:
            return {
                ...state,
                uploadImagesSuccessResponse: action.payload as IServerResponse,
            };

        case ReduxImageActions.SET_UPLOAD_IMAGES_FAILURE_RESPONSE:
            return {
                ...state,
                uploadImagesFailureResponse: action.payload as IServerResponse,
            };

        default:
            return {
                ...state,
            };
    }
};
