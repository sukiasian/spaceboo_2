import { IServerResponse, ReduxAdminAction, ReduxLockerRequestsAction, SagaTask } from '../../types/types';
import { IDeleteLockerRequestPayload } from '../reducers/adminReducer';
import {
    ILockerRequestPayload,
    IRequestLockerConnectionPayload,
    IRequestReturnLockerPayload,
} from '../reducers/lockerRequestsReducer';
import { IAction } from './ActionTypes';

export const postRequestLockerAction = (
    payload: IRequestLockerConnectionPayload
): IAction<SagaTask, IRequestLockerConnectionPayload> => {
    return {
        type: SagaTask.POST_CREATE_LOCKER_REQUEST,
        payload,
    };
};

export const postReturnRequestAction = (
    payload: IRequestReturnLockerPayload
): IAction<SagaTask, IRequestReturnLockerPayload> => {
    return {
        type: SagaTask.POST_CREATE_LOCKER_RETURN_REQUEST,
        payload,
    };
};

export const deleteLockerRequestByIdAction = (
    payload: IDeleteLockerRequestPayload
): IAction<SagaTask, IDeleteLockerRequestPayload> => {
    return {
        type: SagaTask.DELETE_LOCKER_REQUEST_BY_ID,
        payload,
    };
};

export const setPostLockerRequestSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxLockerRequestsAction, IServerResponse> => {
    return {
        type: ReduxLockerRequestsAction.SET_POST_REQUEST_LOCKER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostLockerRequestFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxLockerRequestsAction, IServerResponse> => {
    return {
        type: ReduxLockerRequestsAction.SET_POST_REQUEST_LOCKER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostLockerReturnRequestSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxLockerRequestsAction, IServerResponse> => {
    return {
        type: ReduxLockerRequestsAction.SET_POST_REQUEST_LOCKER_RETURN_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostLockerReturnRequestFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxLockerRequestsAction, IServerResponse> => {
    return {
        type: ReduxLockerRequestsAction.SET_POST_REQUEST_LOCKER_RETURN_FAILURE_RESPONSE,
        payload,
    };
};

export const setDeleteLockerRequestByIdSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAdminAction, IServerResponse> => {
    return {
        type: ReduxAdminAction.SET_DELETE_LOCKER_REQUESTS_BY_ID_SUCCESS_RESPONSE,
        payload,
    };
};
export const setDeleteLockerRequestByIdFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAdminAction> => {
    return {
        type: ReduxAdminAction.SET_DELETE_LOCKER_REQUESTS_BY_ID_FAILURE_RESPONSE,
        payload,
    };
};

export const setLockerRequestPayloadAction = (
    payload: ILockerRequestPayload
): IAction<ReduxLockerRequestsAction, ILockerRequestPayload> => {
    return {
        type: ReduxLockerRequestsAction.SET_REQUEST_LOCKER_PAYLOAD,
        payload,
    };
};

export const setLockerReturnRequestPayloadAction = (
    payload: IRequestReturnLockerPayload
): IAction<ReduxLockerRequestsAction, IRequestReturnLockerPayload> => {
    return {
        type: ReduxLockerRequestsAction.SET_REQUEST_LOCKER_RETURN_PAYLOAD,
        payload,
    };
};

export const annualizeLockerRequestResponsesAction = (): IAction<ReduxLockerRequestsAction> => {
    return {
        type: ReduxLockerRequestsAction.ANNUALIZE_POST_REQUEST_LOCKER_RESPONSES,
    };
};

export const annualizeLockerReturnRequestResponsesAction = (): IAction<ReduxLockerRequestsAction> => {
    return {
        type: ReduxLockerRequestsAction.ANNUALIZE_POST_REQUEST_LOCKER_RETURN_RESPONSES,
    };
};
