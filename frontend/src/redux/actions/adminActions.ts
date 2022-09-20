import { IServerResponse, ReduxAdminAction, SagaTask } from '../../types/types';
import { ICreateLockerPayload, IDeleteLockerPayload, IDeleteLockerRequestPayload } from '../reducers/adminReducer';
import { IAction } from './ActionTypes';

export const postPairLockerAction = (payload: ICreateLockerPayload): IAction<SagaTask, ICreateLockerPayload> => {
    return {
        type: SagaTask.POST_PAIR_LOCKER,
        payload,
    };
};

export const postUnpairLockerAction = (payload: IDeleteLockerPayload): IAction<SagaTask, IDeleteLockerPayload> => {
    return {
        type: SagaTask.POST_UNPAIR_LOCKER,
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

export const fetchUnprocessedRequestsAmountAction = (): IAction<SagaTask> => {
    return {
        type: SagaTask.FETCH_UNPROCESSED_LOCKER_REQUESTS_AMOUNT,
    };
};

export const setPostPairLockerSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAdminAction, IServerResponse> => {
    return { type: ReduxAdminAction.SET_POST_PAIR_LOCKER_SUCCESS_RESPONSE, payload };
};

export const setPostPairLockerFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAdminAction, IServerResponse> => {
    return { type: ReduxAdminAction.SET_POST_PAIR_LOCKER_FAILURE_RESPONSE, payload };
};

export const setPostUnpairLockerSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAdminAction, IServerResponse> => {
    return {
        type: ReduxAdminAction.SET_POST_UNPAIR_LOCKER_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostUnpairLockerFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAdminAction, IServerResponse> => {
    return {
        type: ReduxAdminAction.SET_POST_UNPAIR_LOCKER_FAILURE_RESPONSE,
        payload,
    };
};
export const setFetchUnprocessedRequestsAmountSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAdminAction, IServerResponse> => {
    return {
        type: ReduxAdminAction.SET_FETCH_UNPROCESSED_REQUESTS_AMOUNT_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchUnprocessRequestsAmountFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAdminAction, IServerResponse> => {
    return {
        type: ReduxAdminAction.SET_FETCH_UNPROCESSED_REQUESTS_AMOUNT_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchLockerRequestsByQuerySuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAdminAction, IServerResponse> => {
    return {
        type: ReduxAdminAction.SET_FETCH_LOCKER_REQUESTS_BY_QUERY_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchLockerRequestsByQueryFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAdminAction, IServerResponse> => {
    return {
        type: ReduxAdminAction.SET_FETCH_LOCKER_REQUESTS_BY_QUERY_FAILURE_RESPONSE,
        payload,
    };
};
