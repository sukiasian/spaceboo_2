import { IServerResponse, ReduxLockerRequestsAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface ILockerRequestsState {
    postRequestLockerSuccessResponse?: IServerResponse;
    postRequestLockerFailureResponse?: IServerResponse;
    postRequestLockerReturnSuccessResponse?: IServerResponse;
    postRequestLockerReturnFailureResponse?: IServerResponse;
    requestLockerPayload?: ILockerRequestPayload;
}

export interface ILockerRequestPayload {
    phoneNumber?: string;
    spaceId?: string;
}

export interface IRequestLockerConnectionPayload extends ILockerRequestPayload {}

export interface IRequestReturnLockerPayload extends ILockerRequestPayload {}

const initialState: ILockerRequestsState = {};

export const lockerRequestsReducer = (state = initialState, action: IAction): ILockerRequestsState => {
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

        case ReduxLockerRequestsAction.SET_REQUEST_LOCKER_PAYLOAD:
            return {
                ...state,
                requestLockerPayload: action.payload,
            };

        case ReduxLockerRequestsAction.ANNUALIZE_POST_REQUEST_LOCKER_RESPONSES:
            return {
                ...state,
                postRequestLockerSuccessResponse: undefined,
                postRequestLockerFailureResponse: undefined,
            };

        case ReduxLockerRequestsAction.ANNUALIZE_POST_REQUEST_LOCKER_RETURN_RESPONSES:
            return {
                ...state,
                postRequestLockerReturnSuccessResponse: undefined,
                postRequestLockerReturnFailureResponse: undefined,
            };

        default: {
            return {
                ...state,
            };
        }
    }
};
