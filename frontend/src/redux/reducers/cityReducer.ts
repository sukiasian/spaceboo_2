import { IServerResponse, ReduxCitiesAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface ICityState {
    fetchCitiesByPatternSuccessResponse?: IServerResponse;
    fetchCitiesByPatternFailureResponse?: IServerResponse;
}

const initialState: ICityState = {};

export const cityReducer = (state = initialState, action: IAction): ICityState => {
    switch (action.type) {
        case ReduxCitiesAction.SET_FETCH_CITIES_BY_SEARCH_PATTERN_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchCitiesByPatternSuccessResponse: action.payload,
            };

        case ReduxCitiesAction.SET_FETCH_CITIES_BY_SEARCH_PATTERN_FAILURE_RESPONSE:
            return {
                ...state,
                fetchCitiesByPatternFailureResponse: action.payload,
            };

        case ReduxCitiesAction.ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES_RESPONSES:
            return {
                ...state,
                fetchCitiesByPatternSuccessResponse: undefined,
                fetchCitiesByPatternFailureResponse: undefined,
            };

        default: {
            return {
                ...state,
            };
        }
    }
};
