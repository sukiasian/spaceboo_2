import { ReduxCommonActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface ICommonState {
    timerIsOn: boolean;
}

const initialState: ICommonState = {
    timerIsOn: false,
};

export const commonReducer = (state = initialState, action: IAction): ICommonState => {
    switch (action.type) {
        case ReduxCommonActions.TOGGLE_TIMER:
            return {
                ...state,
                timerIsOn: !state.timerIsOn,
            };

        default:
            return {
                ...state,
            };
    }
};
