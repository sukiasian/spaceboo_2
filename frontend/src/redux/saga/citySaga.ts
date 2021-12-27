import { call, put, takeEvery, StrictEffect, PutEffect, ForkEffect, takeLatest } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, ReduxCitiesActions, SagaTasks } from '../../types/types';
import { IAction } from '../actions/ActionTypes';
import { fetchCitiesAction } from '../actions/cityActions';

const fetchCities = async (): Promise<object> => {
    return (await httpRequester.get(ApiUrls.CITIES)).data;
};

function* citiesWorker(): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(fetchCities);

    yield put({ type: ReduxCitiesActions.FETCH_CITIES, payload });
}
export function* watchCities(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_CITIES, citiesWorker);
}

const fetchCitiesBySearchPattern = async (findCitySearchPattern: string): Promise<object | void> => {
    if (findCitySearchPattern.length) {
        return (await httpRequester.get(`${ApiUrls.CITIES}?searchPattern=%25${findCitySearchPattern}%25`)).data;
    }
};

function* findCitiesBySearchPatternWorker(action: IAction): Generator<StrictEffect, void, PutEffect> {
    const payload = yield call(fetchCitiesBySearchPattern, action.payload);

    yield put(fetchCitiesAction(payload));
}
export function* watchFindCitiesBySearchPattern(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.REQUEST_CITIES_BY_SEARCH_PATTERN, findCitiesBySearchPatternWorker);
}
