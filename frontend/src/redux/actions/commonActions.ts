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

export const toggleMyAppointmentsPageIsLoaded = (): IAction<ReduxCommonActions> => {
    return {
        type: ReduxCommonActions.SET_MY_APPOINTMENTS_PAGE_IS_LOADED_TO_TRUE,
    };
};
