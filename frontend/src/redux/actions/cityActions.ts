import { Action } from 'redux';
import { IServerResponse, ReduxCitiesAction, SagaTask } from '../../types/types';
import { IAction } from './ActionTypes';

export const fetchCitiesAction = (): Action<SagaTask> => {
    return {
        type: SagaTask.FETCH_CITIES,
    };
};
export const fetchCitiesBySearchPatternAction = (payload: string): IAction<SagaTask, string> => {
    return {
        type: SagaTask.FETCH_CITIES_BY_SEARCH_PATTERN,
        payload,
    };
};
export const setFetchCitiesByPatternSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxCitiesAction, IServerResponse> => {
    return {
        type: ReduxCitiesAction.SET_FETCH_CITIES_BY_SEARCH_PATTERN_SUCCESS_RESPONSE,
        payload,
    };
};
export const setFetchCitiesByPatternFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxCitiesAction, IServerResponse> => {
    return {
        type: ReduxCitiesAction.SET_FETCH_CITIES_BY_SEARCH_PATTERN_FAILURE_RESPONSE,
        payload,
    };
};
export const annualizeFoundBySearchPatternCitiesAction = (): Action<ReduxCitiesAction> => {
    return {
        type: ReduxCitiesAction.ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES_RESPONSES,
    };
};
