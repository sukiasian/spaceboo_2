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
        payload: payload,
    };
};

export const annualizeFoundBySearchPatternCitiesAction = (): Action<ReduxCitiesActions> => {
    return {
        type: ReduxCitiesActions.ANNUALIZE_FOUND_BY_SEARCH_PATTERN_CITIES,
    };
};
