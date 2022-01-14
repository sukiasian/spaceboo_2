import { IServerFailureResponse, IServerSuccessResponse, ReduxImageActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

type TImagePayloads = IServerSuccessResponse | IServerFailureResponse;

interface IInitialState {
    uploadImagesSuccessResponse?: IServerSuccessResponse;
    uploadImagesFailureResponse?: IServerFailureResponse;
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
                uploadImagesSuccessResponse: action.payload as IServerSuccessResponse,
            };

        case ReduxImageActions.SET_UPLOAD_IMAGES_FAILURE_RESPONSE:
            return {
                ...state,
                uploadImagesFailureResponse: action.payload as IServerFailureResponse,
            };

        default:
            return {
                ...state,
            };
    }
};
