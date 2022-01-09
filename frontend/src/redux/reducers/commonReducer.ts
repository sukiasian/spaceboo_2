import { ReduxCommonActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IDatePickerDate {
    year: number;
    month: number;
}
export interface ICommonState {
    timerIsOn: boolean;
    datePickerDate: IDatePickerDate;
}

const initialState: ICommonState = {
    timerIsOn: false,
    datePickerDate: {
        year: 0,
        month: 0,
    },
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

        default:
            return {
                ...state,
            };
    }
};
