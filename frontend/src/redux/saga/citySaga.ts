import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, HttpStatus, IServerResponse, SagaTasks } from '../../types/types';
import { IAction } from '../actions/ActionTypes';
import { AnyAction } from 'redux';
import {
    setFetchCitiesByPatternFailureResponseAction,
    setFetchCitiesByPatternSuccessResponseAction,
} from '../actions/cityActions';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';

const fetchCitiesBySearchPattern = async (findCitySearchPattern: string): Promise<IServerResponse> => {
    return httpRequester.get(`${ApiUrls.CITIES}?searchPattern=%25${findCitySearchPattern}%25`);
};
function* findCitiesBySearchPatternWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
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
export function* watchFindCitiesBySearchPattern(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.REQUEST_CITIES_BY_SEARCH_PATTERN, findCitiesBySearchPatternWorker);
}
