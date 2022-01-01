import {
    IPostCheckVerificationEmailCodePayload,
    IPostSendVerificationEmailPayload,
} from '../reducers/emailVerificationReducer';
import { ReduxEmailVerificationActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export const postSendVerificationCodeAction: (
    payload: IPostSendVerificationEmailPayload
) => IAction<SagaTasks, IPostSendVerificationEmailPayload> = ({ purpose, email }) => {
    return {
        type: SagaTasks.POST_SEND_VERIFICATION_CODE,
        payload: {
            purpose,
            email,
        },
    };
};

export const postCheckVerificationCodeAction: (
    payload: IPostCheckVerificationEmailCodePayload
) => IAction<SagaTasks, IPostCheckVerificationEmailCodePayload> = ({
    currentCode,
    email,
    recovery,
    confirmation,
}): IAction<SagaTasks, IPostCheckVerificationEmailCodePayload> => {
    return {
        type: SagaTasks.POST_CHECK_VERIFICATION_CODE,
        payload: {
            currentCode,
            email,
            recovery,
            confirmation,
        },
    };
};

export const annualizeSendVerificationCodeResponse =
    (): IAction<ReduxEmailVerificationActions.ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSE> => {
        return {
            type: ReduxEmailVerificationActions.ANNUALIZE_SEND_VERIFICATION_CODE_RESPONSE,
        };
    };
