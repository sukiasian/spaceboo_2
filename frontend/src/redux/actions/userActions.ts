import { IServerResponse, ReduxUserAction, SagaTask } from '../../types/types';
import { IEditUserData } from '../reducers/userReducer';
import { IAction } from './ActionTypes';

export const fetchCurrentUserAction = (): IAction<SagaTask> => {
    return {
        type: SagaTask.FETCH_CURRENT_USER,
    };
};

export const putEditUserAction = (payload: IEditUserData): IAction<SagaTask, IEditUserData> => {
    return {
        type: SagaTask.PUT_EDIT_USER,
        payload,
    };
};

export const annualizeEditUserResponsesAction = (): IAction<ReduxUserAction> => {
    return {
        type: ReduxUserAction.ANNUALIZE_EDIT_USER_RESPONSES,
    };
};

export const setFetchCurrentUserSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxUserAction, IServerResponse> => {
    return {
        type: ReduxUserAction.SET_FETCH_CURRENT_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchCurrentUserFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxUserAction, IServerResponse> => {
    return {
        type: ReduxUserAction.SET_FETCH_CURRENT_USER_FAILURE_RESPONSE,
        payload,
    };
};

export const setPutEditUserSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxUserAction, IServerResponse> => {
    return {
        type: ReduxUserAction.SET_PUT_EDIT_USER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPutEditUserFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxUserAction, IServerResponse> => {
    return {
        type: ReduxUserAction.SET_PUT_EDIT_USER_FAILURE_RESPONSE,
        payload,
    };
};

export const setEditUserData = (payload: IEditUserData): IAction<ReduxUserAction, IEditUserData> => {
    return {
        type: ReduxUserAction.SET_EDIT_USER_DATA,
        payload,
    };
};
