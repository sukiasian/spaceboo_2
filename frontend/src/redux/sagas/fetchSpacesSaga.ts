import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IQueryData } from '../../components/Filters';
import { IServerResponse, ApiUrl, SagaTask, QueryDefaultValue } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setFetchSpacesSuccessResponseAction, setFetchSpacesFailureResponseAction } from '../actions/spaceActions';

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

const fetchSpaces = async (queryData?: IQueryData): Promise<IServerResponse> => {
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
        `${ApiUrl.SPACES}/?cityId=${
            queryData?.cityId || ''
        }&priceRange=${priceRangeQueryString}&datesToReserveQuery=${datesToReserveQueryString}&page=${
            queryData?.page || QueryDefaultValue.PAGE
        }&sortBy=${queryData?.sortBy || ''}&limit=${queryData?.limit || QueryDefaultValue.LIMIT}&offset=${
            queryData?.offset || QueryDefaultValue.OFFSET
        }`
    );
};

function* fetchSpacesWorker(action: IAction): Generator<CallEffect<IServerResponse> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchSpaces, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setFetchSpacesSuccessResponseAction((response as IServerResponse).data));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setFetchSpacesFailureResponseAction(err as IServerResponse));
    }
}
export function* watchFetchSpaces(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.FETCH_SPACES, fetchSpacesWorker);
}
