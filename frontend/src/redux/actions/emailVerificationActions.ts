import {
    IPostCheckVerificationEmailCodePayload,
    IPostSendVerificationEmailPayload,
} from '../reducers/emailVerificationReducer';
import { IServerResponse, ReduxEmailVerificationAction, SagaTask } from '../../types/types';
import { IAction } from './ActionTypes';

export const postSendVerificationCodeAction: (
    payload: IPostSendVerificationEmailPayload
) => IAction<SagaTask, IPostSendVerificationEmailPayload> = ({ purpose, email }) => {
    return {
        type: SagaTask.POST_SEND_VERIFICATION_CODE,
        payload: {
            purpose,
            email,
        },
    };
};

export const postCheckVerificationCodeAction: (
    payload: IPostCheckVerificationEmailCodePayload
) => IAction<SagaTask, IPostCheckVerificationEmailCodePayload> = ({
    currentCode,
    email,
    recovery,
    confirmation,
}): IAction<SagaTask, IPostCheckVerificationEmailCodePayload> => {
    return {
        type: SagaTask.POST_CHECK_VERIFICATION_CODE,
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
): IAction<ReduxEmailVerificationAction, IServerResponse> => {
    return {
        type: ReduxEmailVerificationAction.SET_POST_SEND_VERIFICATION_CODE_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostSendVerificationCodeFailureResponse = (
    payload: IServerResponse
): IAction<ReduxEmailVerificationAction, IServerResponse> => {
    return {
        type: ReduxEmailVerificationAction.SET_POST_SEND_VERIFICATION_CODE_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizeSendVerificationCodeResponse =
    (): IAction<ReduxEmailVerificationAction.ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSES> => {
        return {
            type: ReduxEmailVerificationAction.ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSES,
        };
    };

export const setPostCheckVerificationCodeSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxEmailVerificationAction, IServerResponse> => {
    return {
        type: ReduxEmailVerificationAction.SET_POST_CHECK_VERIFICATION_CODE_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostCheckVerificationCodeFailureResponse = (
    payload: IServerResponse
): IAction<ReduxEmailVerificationAction, IServerResponse> => {
    return {
        type: ReduxEmailVerificationAction.SET_POST_CHECK_VERIFICATION_CODE_FAILURE_RESPONSE,
        payload,
    };
};
