import { IServerResponse, ReduxUserActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IUserState {
    fetchCurrentUserSuccessResponse?: IServerResponse;
    fetchCurrentUserFailureResponse?: IServerResponse;
}

const initialState: IUserState = {};

export const userReducer = (state = initialState, action: IAction): IUserState => {
    switch (action.type) {
        case ReduxUserActions.SET_FETCH_CURRENT_USER_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchCurrentUserSuccessResponse: action.payload,
            };

        case ReduxUserActions.SET_FETCH_CURRENT_USER_FAILURE_RESPONSE:
            return {
                ...state,
                fetchCurrentUserFailureResponse: action.payload,
            };

        default:
            return {
                ...state,
            };
    }
};
