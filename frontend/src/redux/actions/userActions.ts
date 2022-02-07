import { IServerResponse, ReduxUserActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export const requestCurrentUserAction = (): IAction<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_CURRENT_USER,
    };
};

export const setFetchCurrentUserSuccessResponseAction = (payload: IServerResponse): IAction<ReduxUserActions> => {
    return {
        type: ReduxUserActions.SET_FETCH_CURRENT_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchCurrentUserFailureResponseAction = (payload: IServerResponse): IAction<ReduxUserActions> => {
    return {
        type: ReduxUserActions.SET_FETCH_CURRENT_USER_FAILURE_RESPONSE,
        payload,
    };
};
