import { ReduxCommonAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IDatePickerDate {
    year: number;
    month: number;
}
export interface ICommonState {
    timerIsOn: boolean;
    datePickerDate: IDatePickerDate;
    myAppointmentsFinalLocationIsDefined: boolean;
}

const initialState: ICommonState = {
    timerIsOn: false,
    datePickerDate: {
        year: 0,
        month: 0,
    },
    myAppointmentsFinalLocationIsDefined: true,
};

export const commonReducer = (state = initialState, action: IAction): ICommonState => {
    switch (action.type) {
        case ReduxCommonAction.TOGGLE_TIMER:
            return {
                ...state,
                timerIsOn: !state.timerIsOn,
            };

        case ReduxCommonAction.SET_DATE_PICKER_DATE:
            return {
                ...state,
                datePickerDate: action.payload,
            };

        // NOTE: why toggle doesnt work? because when page is rendered there is a condition - if isLoaded !== false
        // then dispatch. thus when we dispatch we get our isloaded === true thus we are moved again to outdated. so we need to change the
        // condition.

        case ReduxCommonAction.SET_MY_APPOINTMENTS_FINAL_DESTINATION_IS_DEFINED:
            return {
                ...state,
                myAppointmentsFinalLocationIsDefined: !state.myAppointmentsFinalLocationIsDefined,
            };

        default:
            return {
                ...state,
            };
    }
};
