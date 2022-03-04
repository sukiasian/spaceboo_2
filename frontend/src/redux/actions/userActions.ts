import { IServerResponse, ReduxUserActions, SagaTasks } from '../../types/types';
import { IEditUserData } from '../reducers/userReducer';
import { IAction } from './ActionTypes';

export const fetchCurrentUserAction = (): IAction<SagaTasks> => {
    return {
        type: SagaTasks.FETCH_CURRENT_USER,
    };
};

export const putEditUserAction = (payload: IEditUserData): IAction<SagaTasks, IEditUserData> => {
    return {
        type: SagaTasks.PUT_EDIT_USER,
        payload,
    };
};

export const setFetchCurrentUserSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxUserActions, IServerResponse> => {
    return {
        type: ReduxUserActions.SET_FETCH_CURRENT_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchCurrentUserFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxUserActions, IServerResponse> => {
    return {
        type: ReduxUserActions.SET_FETCH_CURRENT_USER_FAILURE_RESPONSE,
        payload,
    };
};

export const setPutEditUserSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxUserActions, IServerResponse> => {
    return {
        type: ReduxUserActions.SET_PUT_EDIT_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPutEditUserFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxUserActions, IServerResponse> => {
    return {
        type: ReduxUserActions.SET_PUT_EDIT_USER_FAILURE_RESPONSE,
        payload,
    };
};

export const setEditUserData = (payload: IEditUserData): IAction<ReduxUserActions, IEditUserData> => {
    return {
        type: ReduxUserActions.SET_EDIT_USER_DATA,
        payload,
    };
};
