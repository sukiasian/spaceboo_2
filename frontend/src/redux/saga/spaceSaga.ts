import { call, put, takeEvery, PutEffect, ForkEffect, CallEffect } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, IServerSuccessResponse, IServerFailureResponse, SagaTasks, TServerResponse } from '../../types/types';
import { IAction } from '../actions/ActionTypes';
import { IQueryData } from '../../components/Filters';
import { AnyAction } from 'redux';
import { fetchSpacesFailureAction, fetchSpacesSuccessAction } from '../actions/spaceActions';

// TODO разобраться с типами ответов с бэкенда

interface IPriceRangeQueryString {
    priceFrom?: string;
    priceTo?: string;
}
interface IDatesToReserveRangeQueryString {
    beginningDate?: string;
    endingDate?: string;
}

const generatePriceRangeQueryString = (queryString: IPriceRangeQueryString): string => {
    if (queryString.priceFrom && !queryString.priceTo) {
        return `${queryString.priceFrom}`;
    } else if (queryString.priceFrom && queryString.priceTo) {
        return `${queryString.priceFrom},${queryString.priceTo}`;
    } else if (!queryString.priceFrom && queryString.priceTo) {
        return `0,${queryString.priceTo}`;
    }

    return '';
};
const generateDatesToReserveRangeQueryString = (queryString: IDatesToReserveRangeQueryString): string => {
    return queryString.beginningDate ? `${queryString.beginningDate},${queryString.endingDate}` : '';
};

const fetchSpaces = async (queryData?: IQueryData): Promise<TServerResponse> => {
    const priceRangeQueryString = generatePriceRangeQueryString({
        priceFrom: queryData?.priceFrom as string,
        priceTo: queryData?.priceTo as string,
    });
    // FIXME на бэке поменять название с datesToReserve на requestedDatesToLookUp (или ...ToReserve)
    const datesToReserveQueryString = generateDatesToReserveRangeQueryString({
        beginningDate: queryData?.beginningDate,
        endingDate: queryData?.endingDate,
    });

    return httpRequester.get(
        `${ApiUrls.SPACES}/?cityId=${
            queryData?.cityId || ''
        }&priceRange=${priceRangeQueryString}&datesToReserveQuery=${datesToReserveQueryString}&page=${
            queryData?.page || ''
        }&sortBy=${queryData?.sortBy || ''}&limit=${queryData?.limit || ''}&offset=12`
    );
};
function* spaceWorker(action: IAction): Generator<CallEffect<TServerResponse> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchSpaces, action.payload);

        if (
            (response as IServerSuccessResponse).statusCode >= 200 &&
            (response as IServerSuccessResponse).statusCode < 300
        ) {
            yield put(fetchSpacesSuccessAction(response as IServerSuccessResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(fetchSpacesFailureAction(err as IServerFailureResponse));
    }
}
export function* watchSpaces(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_SPACES, spaceWorker);
}
