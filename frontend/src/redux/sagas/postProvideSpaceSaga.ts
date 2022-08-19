import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setProvideSpaceSuccessResponseAction, setProvideSpaceFailureResponseAction } from '../actions/spaceActions';
import { IProvideSpaceData } from '../reducers/spaceReducer';

const postProvideSpace = (formData: IProvideSpaceData): Promise<IServerResponse> => {
    //  FIXME NOTE locker connected should not be sent through client (guess it has default value and cannot be set manually)
    const formDataParsed = new FormData();

    for (const field in formData) {
        if (field !== 'spaceImages') {
            // @ts-ignore
            formDataParsed.append(field, formData[field]);
        }
    }

    if (formData.spaceImages) {
        formData.spaceImages!.forEach((image: any) => {
            formDataParsed.append('spaceImages', image);
        });
    } else {
        throw Error('Пожалуйста, заполните все необходимые поля.');
    }

    return httpRequester.postMultipartFormData(`${ApiUrl.SPACES}`, formDataParsed);
};

function* postProvideSpaceWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(postProvideSpace, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setProvideSpaceSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setProvideSpaceFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPostProvideSpace(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTask.POST_PROVIDE_SPACE, postProvideSpaceWorker);
}

