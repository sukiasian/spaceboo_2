import { ReduxCommonActions } from '../../types/types';
import { IDatePickerDate } from '../reducers/commonReducer';
import { IAction } from './ActionTypes';

export const toggleTimerAction = (): IAction<ReduxCommonActions> => {
    return {
        type: ReduxCommonActions.TOGGLE_TIMER,
    };
};

export const setDatePickerDateAction = (payload: IDatePickerDate): IAction<ReduxCommonActions> => {
    return {
        type: ReduxCommonActions.SET_DATE_PICKER_DATE,
        payload,
    };
};

export const toggleMyAppointmentsFinalLocationIsDefined = (): IAction<ReduxCommonActions> => {
    return {
        type: ReduxCommonActions.SET_MY_APPOINTMENTS_FINAL_DESTINATION_IS_DEFINED,
    };
};
