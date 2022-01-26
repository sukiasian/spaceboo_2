import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery, takeLatest } from '@redux-saga/core/effects';
import { httpRequester } from '../../utils/HttpRequest';
import { ApiUrls, SagaTasks, IServerResponse } from '../../types/types';
import { IAction } from '../actions/ActionTypes';
import { IQueryData } from '../../components/Filters';
import { AnyAction } from 'redux';
import {
    fetchSpacesFailureAction,
    fetchSpacesSuccessAction,
    setProvideSpaceFailureResponseAction,
    setProvideSpaceSuccessResponseAction,
} from '../actions/spaceActions';
import { IProvideSpaceData } from '../reducers/spaceReducer';

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
        `${ApiUrls.SPACES}/?cityId=${
            queryData?.cityId || ''
        }&priceRange=${priceRangeQueryString}&datesToReserveQuery=${datesToReserveQueryString}&page=${
            queryData?.page || ''
        }&sortBy=${queryData?.sortBy || ''}&limit=${queryData?.limit || ''}&offset=12`
    );
};
function* fetchSpacesWorker(action: IAction): Generator<CallEffect<IServerResponse> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(fetchSpaces, action.payload);

        if ((response as IServerResponse).statusCode >= 200 && (response as IServerResponse).statusCode < 300) {
            yield put(fetchSpacesSuccessAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(fetchSpacesFailureAction(err as IServerResponse));
    }
}
export function* watchFetchSpaces(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTasks.REQUEST_SPACES, fetchSpacesWorker);
}

const postProvideSpace = (formData: IProvideSpaceData) => {
    //  связать файлы с json и передать на сервер где они будут обработаны одним запросом
    //  FIXME NOTE locker connected should not be sent through client (guess it has default value and cannot be set manually)
    const headers: HeadersInit = {
        'Content-Type': 'multipart/form-data',
    };

    // formData.cityId = 1;

    const fd = new FormData();

    for (const field in formData) {
        if (field !== 'spaceImages') {
            // @ts-ignore
            fd.append(field, formData[field]);
        }
    }
    console.log(formData.spaceImages);

    // for (const key in formData.spaceImages) {
    //     // @ts-ignore
    //     console.log(key, formData[key]);
    //     // @ts-ignore
    //     if (key !== 'length' && key !== 'item') {
    //         // @ts-ignore
    //         fd.append('spaceImages', formData[key]);
    //     }
    // }

    // @ts-ignore
    fd.append('spaceImages', formData.spaceImages[0]);
    fd.append('cityId', '1');

    return fetch('/api/v1/spaces', {
        method: 'POST',
        // @ts-ignore
        body: fd,
    });
};
function* postProvideSpaceWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postProvideSpace, action.payload);

        if ((response as IServerResponse).statusCode >= 200 && (response as IServerResponse).statusCode < 300) {
            yield put(setProvideSpaceSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setProvideSpaceFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostProvideSpace(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.POST_PROVIDE_SPACE, postProvideSpaceWorker);
}
