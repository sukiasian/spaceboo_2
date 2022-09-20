import { IServerResponse, ReduxLockerAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface ILockerState {
    postUnlockLockerSuccessResponse?: IServerResponse;
    postUnlockLockerFailureResponse?: IServerResponse;
}

const initialState: ILockerState = {};

export const lockerReducer = (state = initialState, action: IAction): ILockerState => {
    switch (action.type) {
        case ReduxLockerAction.SET_POST_UNLOCK_LOCKER_SUCCESS_RESPONSE:
            return {
                ...state,
                postUnlockLockerSuccessResponse: action.payload,
            };

        case ReduxLockerAction.SET_POST_UNLOCK_LOCKER_FAILURE_RESPONSE:
            return {
                ...state,
                postUnlockLockerFailureResponse: action.payload,
            };

        default: {
            return {
                ...state,
            };
        }
    }
};
