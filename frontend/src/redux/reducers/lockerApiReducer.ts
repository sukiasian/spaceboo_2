import { IServerResponse, ReduxLockerApiAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface ILockerApiState {
    postUnlockSuccessResponse?: IServerResponse;
    postUnlockFailureResponse?: IServerResponse;
}

export interface IUnlockLockerPayload {
    spaceId: string;
}

const initialState: ILockerApiState = {};

export const lockerApiReducer = (state = initialState, action: IAction): ILockerApiState => {
    switch (action.type) {
        case ReduxLockerApiAction.SET_POST_UNLOCK_LOCKER_SUCCESS_RESPONSE:
            return {
                ...state,
                postUnlockSuccessResponse: action.payload,
            };

        case ReduxLockerApiAction.SET_POST_UNLOCK_LOCKER_FAILURE_RESPONSE:
            return {
                ...state,
                postUnlockFailureResponse: action.payload,
            };

        default: {
            return {
                ...state,
            };
        }
    }
};
