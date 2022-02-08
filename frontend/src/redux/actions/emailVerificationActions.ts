import {
    IPostCheckVerificationEmailCodePayload,
    IPostSendVerificationEmailPayload,
} from '../reducers/emailVerificationReducer';
import { IServerResponse, ReduxEmailVerificationActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export const requestSendVerificationCodeAction: (
    payload: IPostSendVerificationEmailPayload
) => IAction<SagaTasks, IPostSendVerificationEmailPayload> = ({ purpose, email }) => {
    return {
        type: SagaTasks.REQUEST_SEND_VERIFICATION_CODE,
        payload: {
            purpose,
            email,
        },
    };
};

export const requestCheckVerificationCodeAction: (
    payload: IPostCheckVerificationEmailCodePayload
) => IAction<SagaTasks, IPostCheckVerificationEmailCodePayload> = ({
    currentCode,
    email,
    recovery,
    confirmation,
}): IAction<SagaTasks, IPostCheckVerificationEmailCodePayload> => {
    return {
        type: SagaTasks.REQUEST_CHECK_VERIFICATION_CODE,
        payload: {
            currentCode,
            email,
            recovery,
            confirmation,
        },
    };
};

export const setPostSendVerificationCodeSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxEmailVerificationActions, IServerResponse> => {
    return {
        type: ReduxEmailVerificationActions.SET_POST_SEND_VERIFICATION_CODE_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostSendVerificationCodeFailureResponse = (
    payload: IServerResponse
): IAction<ReduxEmailVerificationActions, IServerResponse> => {
    return {
        type: ReduxEmailVerificationActions.SET_POST_SEND_VERIFICATION_CODE_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizeSendVerificationCodeResponse =
    (): IAction<ReduxEmailVerificationActions.ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSES> => {
        return {
            type: ReduxEmailVerificationActions.ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSES,
        };
    };

export const setPostCheckVerificationCodeSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxEmailVerificationActions, IServerResponse> => {
    return {
        type: ReduxEmailVerificationActions.SET_POST_CHECK_VERIFICATION_CODE_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostCheckVerificationCodeFailureResponse = (
    payload: IServerResponse
): IAction<ReduxEmailVerificationActions, IServerResponse> => {
    return {
        type: ReduxEmailVerificationActions.SET_POST_CHECK_VERIFICATION_CODE_FAILURE_RESPONSE,
        payload,
    };
};
