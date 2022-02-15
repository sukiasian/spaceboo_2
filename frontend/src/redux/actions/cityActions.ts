import { Action } from 'redux';
import { IServerResponse, ReduxCitiesActions, SagaTasks } from '../../types/types';
import { IAction } from './ActionTypes';

export const fetchCitiesAction = (): Action<SagaTasks> => {
    return {
        type: SagaTasks.FETCH_CITIES,
    };
};
export const fetchCitiesBySearchPatternAction = (payload: string): IAction<SagaTasks, string> => {
    return {
        type: SagaTasks.FETCH_CITIES_BY_SEARCH_PATTERN,
        payload,
    };
};
export const setFetchCitiesByPatternSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxCitiesActions, IServerResponse> => {
    return {
        type: ReduxCitiesActions.SET_FETCH_CITIES_BY_SEARCH_PATTERN_SUCCESS_RESPONSE,
        payload,
    };
};
export const setFetchCitiesByPatternFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxCitiesActions, IServerResponse> => {
    return {
        type: ReduxCitiesActions.SET_FETCH_CITIES_BY_SEARCH_PATTERN_FAILURE_RESPONSE,
        payload,
    };
};
export const annualizeFoundBySearchPatternCitiesAction = (): Action<ReduxCitiesActions> => {
    return {
        type: ReduxCitiesActions.ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES_RESPONSES,
    };
};
