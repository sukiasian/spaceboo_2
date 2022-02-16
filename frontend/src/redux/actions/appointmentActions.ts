import { IAction } from './ActionTypes';
import { IServerResponse, ReduxAppointmentActions, SagaTasks } from '../../types/types';

export const fetchUserOutdatedAppointments = (): IAction<SagaTasks> => {
    return {
        type: SagaTasks.FETCH_USER_OUTDATED_APPOINTMENTS,
    };
};

export const fetchUserActiveAppointments = (): IAction<SagaTasks> => {
    return {
        type: SagaTasks.FETCH_USER_ACTIVE_APPOINTMENTS,
    };
};

export const fetchUserUpcomingAppointments = (): IAction<SagaTasks> => {
    return {
        type: SagaTasks.FETCH_USER_UPCOMING_APPOINTMENTS,
    };
};

export const setFetchUserOutdatedAppointmentsSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxAppointmentActions> => {
    return {
        type: ReduxAppointmentActions.SET_FETCH_USER_OUTDATED_APPOINTMENTS_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchUserActiveAppointmentsFailureResponse = (
    payload: IServerResponse
): IAction<ReduxAppointmentActions> => {
    return {
        type: ReduxAppointmentActions.SET_FETCH_USER_OUTDATED_APPOINTMENTS_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchUserUpcomingAppointmentsSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxAppointmentActions> => {
    return {
        type: ReduxAppointmentActions.SET_FETCH_USER_OUTDATED_APPOINTMENTS_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchUserOutdatedAppointmentsFailureResponse = (
    payload: IServerResponse
): IAction<ReduxAppointmentActions> => {
    return {
        type: ReduxAppointmentActions.SET_FETCH_USER_OUTDATED_APPOINTMENTS_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchUserActiveAppointmentsSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxAppointmentActions> => {
    return {
        type: ReduxAppointmentActions.SET_FETCH_USER_OUTDATED_APPOINTMENTS_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchUserUpcomingAppointmentsFailureResponse = (
    payload: IServerResponse
): IAction<ReduxAppointmentActions> => {
    return {
        type: ReduxAppointmentActions.SET_FETCH_USER_OUTDATED_APPOINTMENTS_FAILURE_RESPONSE,
        payload,
    };
};
