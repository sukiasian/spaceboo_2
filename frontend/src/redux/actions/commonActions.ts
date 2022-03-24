import { ReduxCommonAction } from '../../types/types';
import { IDatePickerDate } from '../reducers/commonReducer';
import { IAction } from './ActionTypes';

export const toggleTimerAction = (): IAction<ReduxCommonAction> => {
    return {
        type: ReduxCommonAction.TOGGLE_TIMER,
    };
};

export const setDatePickerDateAction = (payload: IDatePickerDate): IAction<ReduxCommonAction> => {
    return {
        type: ReduxCommonAction.SET_DATE_PICKER_DATE,
        payload,
    };
};

export const toggleMyAppointmentsFinalLocationIsDefined = (): IAction<ReduxCommonAction> => {
    return {
        type: ReduxCommonAction.SET_MY_APPOINTMENTS_FINAL_DESTINATION_IS_DEFINED,
    };
};
