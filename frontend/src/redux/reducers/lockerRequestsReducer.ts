import { IQueryString, IServerResponse, ReduxLockerRequestsAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface ILockerState {
    postRequestLockerSuccessResponse?: IServerResponse;
    postRequestLockerFailureResponse?: IServerResponse;
    postRequestLockerReturnSuccessResponse?: IServerResponse;
    postRequestLockerReturnFailureResponse?: IServerResponse;
    fetchAllLockerRequestsQueryData?: IServerResponse;
}

export interface ILockerRequestPayload {
    spaceId: string;
    phoneNumber: string;
}

export interface IRequestLockerConnectionPayload extends ILockerRequestPayload {}

export interface IRequestReturnLockerPayload extends ILockerRequestPayload {
    lockerId: string;
}

export interface IRequestQueryString extends IQueryString {
    type: string | number;
}

const initialState: ILockerState = {};

export const adminReducer = (state = initialState, action: IAction): ILockerState => {
    switch (action.type) {
        case ReduxLockerRequestsAction.SET_POST_REQUEST_LOCKER_SUCCESS_RESPONSE:
            return {
                ...state,
                postRequestLockerSuccessResponse: action.payload,
            };

        case ReduxLockerRequestsAction.SET_POST_REQUEST_LOCKER_FAILURE_RESPONSE:
            return {
                ...state,
                postRequestLockerFailureResponse: action.payload,
            };

        case ReduxLockerRequestsAction.SET_POST_REQUEST_LOCKER_RETURN_SUCCESS_RESPONSE:
            return {
                ...state,
                postRequestLockerReturnSuccessResponse: action.payload,
            };

        case ReduxLockerRequestsAction.SET_POST_REQUEST_LOCKER_RETURN_FAILURE_RESPONSE:
            return {
                ...state,
                postRequestLockerReturnFailureResponse: action.payload,
            };

        case ReduxLockerRequestsAction.SET_FETCH_ALL_LOCKER_REQUESTS_QUERY_DATA:
            return {
                ...state,
                fetchAllLockerRequestsQueryData: action.payload,
            };

        default: {
            return {
                ...state,
            };
        }
    }
};
