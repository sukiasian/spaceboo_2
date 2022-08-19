import { IServerResponse, ReduxAppointmentAction, SagaTask } from '../../types/types';
import {
    ICreateAppointmentPayload,
    IDeleteCancelAppointmentPayload,
    IFetchAppointmentsForMonthPayload,
} from '../reducers/appointmentReducer';
import { IAction } from './ActionTypes';

export const postCreateAppointmentAction = (payload: ICreateAppointmentPayload) => {
    return {
        type: SagaTask.POST_CREATE_APPOINTMENT,
        payload,
    };
};

export const fetchAppointmentsForMonthAction = (payload: IFetchAppointmentsForMonthPayload): IAction<SagaTask> => {
    return {
        type: SagaTask.FETCH_APPOINTMENTS_FOR_MONTH,
        payload,
    };
};

export const deleteCancelAppointmentAction = (
    payload: IDeleteCancelAppointmentPayload
): IAction<SagaTask, IDeleteCancelAppointmentPayload> => {
    return {
        type: SagaTask.DELETE_CANCEL_APPOINTMENT,
        payload,
    };
};

export const setPostCreateAppointmentSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxAppointmentAction, IServerResponse> => {
    return {
        type: ReduxAppointmentAction.SET_POST_CREATE_APPOINTMENT_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPostCreateAppointmentFailureResponse = (
    payload: IServerResponse
): IAction<ReduxAppointmentAction, IServerResponse> => {
    return {
        type: ReduxAppointmentAction.SET_POST_CREATE_APPOINTMENT_FAILURE_RESPONSE,
        payload,
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
