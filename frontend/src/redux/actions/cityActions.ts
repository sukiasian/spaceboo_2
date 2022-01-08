import { Action } from 'redux';
import { ReduxCitiesActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export const requestCitiesAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_CITIES,
    };
};
export const fetchCitiesAction = (payload: any): IAction => {
    return {
        type: ReduxCitiesActions.FETCH_CITIES_BY_SEARCH_PATTERN,
        payload,
    };
};
export const requestMajorCitiesAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_MAJOR_CITIES,
    };
};
export const fetchMajorCitiesAction = (payload: any): IAction => {
    return {
        type: ReduxCitiesActions.FETCH_CITIES_BY_SEARCH_PATTERN,
        payload,
    };
};
export const requestCitiesBySearchPatternAction = (payload: any): IAction<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_CITIES_BY_SEARCH_PATTERN,
        payload,
    };
};
export const annualizeFoundBySearchPatternCitiesAction = (): Action<ReduxCitiesActions> => {
    return {
        type: ReduxCitiesActions.ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES,
    };
};
