import { ReduxAuthActions } from '../../utils/types';
import { IAction } from '../actions/ActionTypes';

export interface IAuthState {
    userIsLoggedIn: boolean;
}

const initialState: IAuthState = {
    userIsLoggedIn: false,
};

export const authReducer = (state: IAuthState = initialState, action: IAction<ReduxAuthActions>): IAuthState => {
    switch (action.type) {
        case ReduxAuthActions.FETCH_USER_IS_LOGGED_IN: {
            return {
                ...state,
                userIsLoggedIn: action.payload,
            };
        }

        default: {
            return { ...state };
        }
    }
};
