import { IServerResponse, ReduxLockerApiAction, SagaTask } from '../../types/types';
import { IUnlockLockerPayload } from '../reducers/lockerApiReducer';
import { IAction } from './ActionTypes';

export const postUnlockLockerAction = (payload: IUnlockLockerPayload): IAction<SagaTask, IUnlockLockerPayload> => {
    return {
        type: SagaTask.POST_UNLOCK_LOCKER,
        payload,
    };
};

export const setPostUnlockLockerSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxLockerApiAction, IServerResponse> => {
    return {
        type: ReduxLockerApiAction.SET_POST_UNLOCK_LOCKER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostUnlockLockerFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxLockerApiAction, IServerResponse> => {
    return {
        type: ReduxLockerApiAction.SET_POST_UNLOCK_LOCKER_FAILURE_RESPONSE,
        payload,
    };
};
