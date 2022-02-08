import { IServerResponse, ReduxEmailVerificationActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export enum EmailPurpose {
    EMAIL_CONFIRMATION = 10,
    PASSWORD_RECOVERY = 11,
}

// FIXME there can be 2 types of response - first success (status, data, message) and second is error response. Implement that

export interface IPostSendVerificationEmailPayload {
    purpose: string;
    email?: string;
}
export interface IPostCheckVerificationEmailCodePayload {
    currentCode: number;
    recovery?: boolean;
    confirmation?: boolean;
    email?: string;
}
export interface IEmailVerificationState {
    postSendVerificationCodeSuccessResponse?: IServerResponse;
    postSendVerificationCodeFailureResponse?: IServerResponse;
    postCheckVerificationCodeSuccessResponse?: IServerResponse;
    postCheckVerificationCodeFailureResponse?: IServerResponse;
}

const initialState: IEmailVerificationState = {};

export const emailVerificationReducer = (
    state = initialState,
    action: IAction<ReduxEmailVerificationActions>
): IEmailVerificationState => {
    switch (action.type) {
        case ReduxEmailVerificationActions.SET_POST_SEND_VERIFICATION_CODE_SUCCESS_RESPONSE:
            return {
                ...state,
                postSendVerificationCodeSuccessResponse: action.payload,
            };

        case ReduxEmailVerificationActions.SET_POST_SEND_VERIFICATION_CODE_FAILURE_RESPONSE:
            return {
                ...state,
                postSendVerificationCodeFailureResponse: action.payload,
            };

        case ReduxEmailVerificationActions.ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSES:
            return {
                ...state,
                postSendVerificationCodeSuccessResponse: undefined,
                postSendVerificationCodeFailureResponse: undefined,
            };

        case ReduxEmailVerificationActions.SET_POST_CHECK_VERIFICATION_CODE_SUCCESS_RESPONSE:
            return {
                ...state,
                postCheckVerificationCodeSuccessResponse: action.payload,
            };

        case ReduxEmailVerificationActions.SET_POST_CHECK_VERIFICATION_CODE_FAILURE_RESPONSE:
            return {
                ...state,
                postCheckVerificationCodeFailureResponse: action.payload,
            };

        default:
            return {
                ...state,
            };
    }
};
