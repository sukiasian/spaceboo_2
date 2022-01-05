import { ReduxCommonActions } from '../../types/types';
import { IAction } from './ActionTypes';

export const toggleTimerAction = (): IAction<ReduxCommonActions> => {
    return {
        type: ReduxCommonActions.TOGGLE_TIMER,
    };
};
