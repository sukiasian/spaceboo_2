import { IServerResponse, ReduxUserActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IUserState {
    fetchCurrentUserSuccessResponse?: IServerResponse;
    fetchCurrentUserFailureResponse?: IServerResponse;
    editUserData?: IEditUserData;
    putEditUserSuccessResponse?: IServerResponse;
    putEditUserFailureResponse?: IServerResponse;
}
export interface IEditUserData {
    name?: string;
    surname?: string;
    middleName?: string;
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

        case ReduxUserActions.SET_EDIT_USER_DATA:
            return {
                ...state,
                editUserData: action.payload,
            };

        case ReduxUserActions.SET_PUT_EDIT_USER_SUCCESS_RESPONSE:
            return {
                ...state,
                putEditUserSuccessResponse: action.payload,
            };

        case ReduxUserActions.SET_PUT_EDIT_USER_FAILURE_RESPONSE:
            return {
                ...state,
                putEditUserFailureResponse: action.payload,
            };

        default:
            return {
                ...state,
            };
    }
};
