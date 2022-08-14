import { IServerResponse, ReduxAppointmentAction, SagaTask } from '../../types/types';
import { IFetchAppointmentsForMonthPayload } from '../reducers/spaceReducer';
import { IAction } from './ActionTypes';

export const createAppointmentAction = () => {};

export const fetchAppointmentsForMonthAction = (payload: IFetchAppointmentsForMonthPayload): IAction<SagaTask> => {
    return {
        type: SagaTask.FETCH_APPOINTMENTS_FOR_MONTH,
        payload,
    };
};

export const deleteCancelAppointmentAction = (): IAction<SagaTask, void> => {
    return {
        type: SagaTask.DELETE_CANCEL_APPOINTMENT,
    };
};

export const setFetchAppointmentsForMonthSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxAppointmentAction, IServerResponse> => {
    return {
        type: ReduxAppointmentAction.SET_FETCH_APPOINTMENTS_FOR_MONTH_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchAppointmentsForMonthFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxAppointmentAction, IServerResponse> => {
    return {
        type: ReduxAppointmentAction.SET_FETCH_APPOINTMENTS_FOR_MONTH_FAILURE_RESPONSE,
        payload,
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
