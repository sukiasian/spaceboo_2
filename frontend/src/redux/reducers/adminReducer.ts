import { IServerResponse, ReduxAdminAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IAdminReducerState {
    postPairLockerSuccessResponse?: IServerResponse;
    postPairLockerFailureResponse?: IServerResponse;
    postUnpairLockerSuccessResponse?: IServerResponse;
    postUnpairLockerFailureResponse?: IServerResponse;
    fetchUnprocessedRequestsAmountSuccessResponse?: IServerResponse;
    fetchUnprocessRequestsAmountFailureResponse?: IServerResponse;
    deleteLockerRequestByIdSuccessResponse?: IServerResponse;
    deleteLockerRequestByIdFailureResponse?: IServerResponse;
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

const initialState: IAdminReducerState = {};

export const adminReducer = (state = initialState, action: IAction): IAdminReducerState => {
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

        default: {
            return {
                ...state,
            };
        }
    }
};
