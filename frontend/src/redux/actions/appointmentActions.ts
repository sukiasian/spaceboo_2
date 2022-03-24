import { IServerResponse, ReduxAppointmentAction, SagaTask } from '../../types/types';
import { IAction } from './ActionTypes';

export const createAppointmentAction = () => {};

export const deleteCancelAppointmentAction = (): IAction<SagaTask, void> => {
    return {
        type: SagaTask.DELETE_CANCEL_APPOINTMENT,
    };
};

export const setDeleteCancelAppointmentSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAppointmentAction, IServerResponse> => {
    return {
        type: ReduxAppointmentAction.SET_DELETE_CANCEL_APPOINTMENT_SUCCESS_RESPONSE,
        payload,
    };
};

export const setDeleteCancelAppointmentFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAppointmentAction, IServerResponse> => {
    return {
        type: ReduxAppointmentAction.SET_DELETE_CANCEL_APPOINTMENT_FAILURE_RESPONSE,
        payload,
    };
};
