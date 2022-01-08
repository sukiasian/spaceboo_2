import { ReduxCitiesActions } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface ICityState {
    cities: string[];
    majorCities: string[];
    foundBySearchPatternCities: string[];
}

const initialState: ICityState = {
    cities: [],
    majorCities: [],
    foundBySearchPatternCities: [],
};

export const cityReducer = (state = initialState, action: IAction): ICityState => {
    switch (action.type) {
        case ReduxCitiesActions.FETCH_CITIES:
            return {
                ...state,
                cities: action.payload,
            };

        case ReduxCitiesActions.FETCH_CITIES_BY_SEARCH_PATTERN:
            return {
                ...state,
                foundBySearchPatternCities: action.payload,
            };

        case ReduxCitiesActions.FETCH_MAJOR_CITIES:
            return {
                ...state,
                majorCities: action.payload,
            };

        case ReduxCitiesActions.ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES:
            return {
                ...state,
                foundBySearchPatternCities: [],
            };

        default: {
            return {
                ...state,
            };
        }
    }
};
