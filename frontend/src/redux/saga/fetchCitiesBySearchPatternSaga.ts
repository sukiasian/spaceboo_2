import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrls, IServerResponse, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import {
    setFetchCitiesByPatternSuccessResponseAction,
    setFetchCitiesByPatternFailureResponseAction,
} from '../actions/cityActions';

const fetchCitiesBySearchPattern = async (findCitySearchPattern: string): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrls.CITIES}?searchPattern=%25${findCitySearchPattern}%25`);
};

function* fetchCitiesBySearchPatternWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchCitiesBySearchPattern, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchCitiesByPatternSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchCitiesByPatternFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchCitiesBySearchPattern(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.FETCH_CITIES_BY_SEARCH_PATTERN, fetchCitiesBySearchPatternWorker);
}
