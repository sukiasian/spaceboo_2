import { IServerResponse, ReduxLockerAction } from '../../types/types';
import { IAction } from './ActionTypes';

export const setPutToggleLockerSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxLockerAction, IServerResponse> => {
    return {
        type: ReduxLockerAction.SET_PUT_TOGGLE_LOCKER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPutToggleLockerFailureResponse = (
    payload: IServerResponse
): IAction<ReduxLockerAction, IServerResponse> => {
    return {
        type: ReduxLockerAction.SET_PUT_TOGGLE_LOCKER_FAILURE_RESPONSE,
        payload,
    };
};
