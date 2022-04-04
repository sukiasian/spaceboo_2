import { IServerResponse, ReduxLockerAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface ILockerState {
    putToggleLockerSuccessResponse?: IServerResponse;
    putToggleLockerFailureResponse?: IServerResponse;
}

const initialState: ILockerState = {};

export const lockerReducer = (state = initialState, action: IAction): ILockerState => {
    switch (action.type) {
        case ReduxLockerAction.SET_PUT_TOGGLE_LOCKER_SUCCESS_RESPONSE:
            return {
                ...state,
                putToggleLockerSuccessResponse: action.payload,
            };

        case ReduxLockerAction.SET_PUT_TOGGLE_LOCKER_FAILURE_RESPONSE:
            return {
                ...state,
                putToggleLockerFailureResponse: action.payload,
            };

        default: {
            return {
                ...state,
            };
        }
    }
};
