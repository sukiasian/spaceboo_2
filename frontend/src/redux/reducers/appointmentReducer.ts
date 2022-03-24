import { IServerResponse, ReduxAppointmentAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IAppointmentState {
    deleteCancelAppointmentSuccessResponse?: IServerResponse;
    deleteCancelAppointmentFailureResponse?: IServerResponse;
}

const initialState: IAppointmentState = {};

export const appointmentReducer = (state = initialState, action: IAction): IAppointmentState => {
    switch (action.type) {
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
