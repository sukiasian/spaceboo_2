import { ReduxSpaceActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface ISpaceState {
    // spaces: Space[];
    isLoaded: boolean;
    spaces: Array<any>;
}

const initialState: ISpaceState = {
    isLoaded: false,
    spaces: [],
};

export const spaceReducer = (state = initialState, action: IAction): ISpaceState => {
    switch (action.type) {
        case ReduxSpaceActions.FETCH_SPACES: {
            return {
                ...state,
                spaces: action.payload,
            };
        }

        default: {
            return { ...state };
        }
    }
};
