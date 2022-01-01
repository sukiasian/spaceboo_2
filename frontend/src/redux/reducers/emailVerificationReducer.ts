import { ReduxEmailVerificationActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export enum EmailPurpose {
    EMAIL_CONFIRMATION = 10,
    PASSWORD_RECOVERY = 11,
}

// FIXME there can be 2 types of response - first success (status, data, message) and second is error response. Implement that
export interface IEmailVerificationState {
    sendVerificationCodeResponse?: any;
    checkVerificationCodeResponse?: any;
}
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

type TEmailVerificationPayloads = IPostSendVerificationEmailPayload | IPostCheckVerificationEmailCodePayload;

const initialState: IEmailVerificationState = {};

export const emailVerificationReducer = (
    state = initialState,
    action: IAction<ReduxEmailVerificationActions, TEmailVerificationPayloads>
): IEmailVerificationState => {
    switch (action.type) {
        case ReduxEmailVerificationActions.SEND_VERIFICATION_CODE:
            return {
                ...state,
                sendVerificationCodeResponse: action.payload,
            };

        case ReduxEmailVerificationActions.ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSE:
            return {
                ...state,
                sendVerificationCodeResponse: undefined,
            };

        case ReduxEmailVerificationActions.CHECK_VERIFICATION_CODE:
            return {
                ...state,
                checkVerificationCodeResponse: action.payload,
            };

        default:
            return {
                ...state,
            };
    }
};
