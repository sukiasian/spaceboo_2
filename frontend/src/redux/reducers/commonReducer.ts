import { ReduxCommonActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IDatePickerDate {
    year: number;
    month: number;
}
export interface ICommonState {
    timerIsOn: boolean;
    datePickerDate: IDatePickerDate;
    myAppointmentsPageIsLoaded: boolean;
}

const initialState: ICommonState = {
    timerIsOn: false,
    datePickerDate: {
        year: 0,
        month: 0,
    },
    myAppointmentsPageIsLoaded: false,
};

export const commonReducer = (state = initialState, action: IAction): ICommonState => {
    switch (action.type) {
        case ReduxCommonActions.TOGGLE_TIMER:
            return {
                ...state,
                timerIsOn: !state.timerIsOn,
            };

        case ReduxCommonActions.SET_DATE_PICKER_DATE:
            return {
                ...state,
                datePickerDate: action.payload,
            };

        // NOTE: why toggle doesnt work? because when page is rendered there is a condition - if isLoaded !== false
        // then dispatch. thus when we dispatch we get our isloaded === true thus we are moved again to outdated. so we need to change the
        // condition.

        case ReduxCommonActions.SET_MY_APPOINTMENTS_PAGE_IS_LOADED_TO_TRUE:
            return {
                ...state,
                myAppointmentsPageIsLoaded: true,
            };

        case ReduxCommonActions.SET_MY_APPOINTMENTS_PAGE_IS_LOADED_TO_FALSE:
            return {
                ...state,
                myAppointmentsPageIsLoaded: false,
            };

        default:
            return {
                ...state,
            };
    }
};
