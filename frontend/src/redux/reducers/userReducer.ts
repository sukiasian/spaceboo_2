import { ReduxUserActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IUserStore {
    user?: object;
    userAvatarUrl?: string;
}

const initialState: IUserStore = {};
export const userReducer = (state = initialState, action: IAction): IUserStore => {
    switch (action.type) {
        case ReduxUserActions.FETCH_USER:
            return {
                ...state,
                user: action.payload,
            };

        default:
            return {
                ...state,
            };
    }
};
