import { IQueryString, IServerResponse, ReduxAdminAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface ILockerRequestsQueryString extends IQueryString {
    type: string | number;
}

export interface ILockerQueryString extends IQueryString {}

export interface IAdminState {
    postPairLockerSuccessResponse?: IServerResponse;
    postPairLockerFailureResponse?: IServerResponse;
    postUnpairLockerSuccessResponse?: IServerResponse;
    postUnpairLockerFailureResponse?: IServerResponse;
    fetchUnprocessedRequestsAmountSuccessResponse?: IServerResponse;
    fetchUnprocessRequestsAmountFailureResponse?: IServerResponse;
    fetchLockerRequestsByQuerySuccessResponse?: IServerResponse;
    fetchLockerRequestsByQueryFailureResponse?: IServerResponse;
    fetchLockersByQuerySuccessResponse?: IServerResponse;
    fetchLockersByQueryFailureResponse?: IServerResponse;
    deleteLockerRequestByIdSuccessResponse?: IServerResponse;
    deleteLockerRequestByIdFailureResponse?: IServerResponse;
    fetchAllLockerRequestsQueryData?: ILockerRequestsQueryString;
    fetchLockersQueryData?: ILockerQueryString;
}

interface ILockerPayload {
    spaceId: string;
}

export interface ICreateLockerPayload extends ILockerPayload {
    lockerId: string;
}

export interface IDeleteLockerPayload extends ILockerPayload {}

export interface IDeleteLockerRequestPayload {
    requestId: string;
}

export interface ILockerQueryString extends IQueryString {}

const initialState: IAdminState = {};

export const adminReducer = (state = initialState, action: IAction): IAdminState => {
    switch (action.type) {
        case ReduxAdminAction.SET_POST_PAIR_LOCKER_SUCCESS_RESPONSE:
            return {
                ...state,
                postPairLockerSuccessResponse: action.payload,
            };

        case ReduxAdminAction.SET_POST_PAIR_LOCKER_FAILURE_RESPONSE:
            return {
                ...state,
                postPairLockerFailureResponse: action.payload,
            };

        case ReduxAdminAction.SET_POST_UNPAIR_LOCKER_SUCCESS_RESPONSE:
            return {
                ...state,
                postUnpairLockerSuccessResponse: action.payload,
            };

        case ReduxAdminAction.SET_POST_UNPAIR_LOCKER_FAILURE_RESPONSE:
            return {
                ...state,
                postUnpairLockerFailureResponse: action.payload,
            };

        case ReduxAdminAction.SET_FETCH_UNPROCESSED_REQUESTS_AMOUNT_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchUnprocessedRequestsAmountSuccessResponse: action.payload,
            };

        case ReduxAdminAction.SET_FETCH_UNPROCESSED_REQUESTS_AMOUNT_FAILURE_RESPONSE:
            return {
                ...state,
                fetchUnprocessRequestsAmountFailureResponse: action.payload,
            };

        case ReduxAdminAction.SET_FETCH_LOCKER_REQUESTS_BY_QUERY_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchLockerRequestsByQuerySuccessResponse: action.payload,
            };

        case ReduxAdminAction.SET_FETCH_LOCKER_REQUESTS_BY_QUERY_FAILURE_RESPONSE:
            return {
                ...state,
                fetchLockerRequestsByQueryFailureResponse: action.payload,
            };

        case ReduxAdminAction.SET_FETCH_LOCKERS_BY_QUERY_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchLockersByQuerySuccessResponse: action.payload,
            };

        case ReduxAdminAction.SET_FETCH_LOCKERS_BY_QUERY_FAILURE_RESPONSE:
            return {
                ...state,
                fetchLockersByQueryFailureResponse: action.payload,
            };

        case ReduxAdminAction.SET_DELETE_LOCKER_REQUESTS_BY_ID_SUCCESS_RESPONSE:
            return {
                ...state,
                deleteLockerRequestByIdSuccessResponse: action.payload,
            };

        case ReduxAdminAction.SET_DELETE_LOCKER_REQUESTS_BY_ID_FAILURE_RESPONSE:
            return {
                ...state,
                deleteLockerRequestByIdFailureResponse: action.payload,
            };

        case ReduxAdminAction.SET_FETCH_ALL_LOCKER_REQUESTS_QUERY_DATA:
            return {
                ...state,
                fetchAllLockerRequestsQueryData: action.payload,
            };

        case ReduxAdminAction.SET_FETCH_LOCKERS_QUERY_DATA:
            return {
                ...state,
                fetchLockersQueryData: action.payload,
            };

        default: {
            return {
                ...state,
            };
        }
    }
};
