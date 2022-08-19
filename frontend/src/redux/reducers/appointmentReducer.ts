import { IDatesRange } from '../../components/Filters';
import { IServerResponse, ReduxAppointmentAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IAppointmentState {
    postCreateAppointmentSuccessResponse?: IServerResponse;
    postCreateAppointmentFailureResponse?: IServerResponse;
    fetchAppointmentsForMonthSuccessResponse?: IServerResponse;
    fetchAppointmentsForMonthFailureResponse?: IServerResponse;
    deleteCancelAppointmentSuccessResponse?: IServerResponse;
    deleteCancelAppointmentFailureResponse?: IServerResponse;
}

interface IResIsoDatesToReserve extends IDatesRange {
    beginningTime?: string;
    endingTime?: string;
}

export interface ICreateAppointmentPayload {
    resIsoDatesToReserve: IResIsoDatesToReserve;
    spaceId: string;
}

export interface IFetchAppointmentsForMonthPayload {
    spaceId: string;
    requiredDates: string;
}

export interface IDeleteCancelAppointmentPayload {
    spaceId: string;
}

const initialState: IAppointmentState = {};

export const appointmentReducer = (state = initialState, action: IAction): IAppointmentState => {
    switch (action.type) {
        case ReduxAppointmentAction.SET_POST_CREATE_APPOINTMENT_SUCCESS_RESPONSE:
            return {
                ...state,
                postCreateAppointmentSuccessResponse: action.payload,
            };

        case ReduxAppointmentAction.SET_POST_CREATE_APPOINTMENT_FAILURE_RESPONSE:
            return {
                ...state,
                postCreateAppointmentFailureResponse: action.payload,
            };

        case ReduxAppointmentAction.SET_FETCH_APPOINTMENTS_FOR_MONTH_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchAppointmentsForMonthSuccessResponse: action.payload,
            };

        case ReduxAppointmentAction.SET_FETCH_APPOINTMENTS_FOR_MONTH_FAILURE_RESPONSE:
            return {
                ...state,
                fetchAppointmentsForMonthFailureResponse: action.payload,
            };

        case ReduxAppointmentAction.SET_DELETE_CANCEL_APPOINTMENT_SUCCESS_RESPONSE:
            return {
                ...state,
                deleteCancelAppointmentSuccessResponse: action.payload,
            };

        case ReduxAppointmentAction.SET_DELETE_CANCEL_APPOINTMENT_FAILURE_RESPONSE:
            return {
                ...state,
                deleteCancelAppointmentFailureResponse: action.payload,
            };

        default: {
            return {
                ...state,
            };
        }
    }
};
