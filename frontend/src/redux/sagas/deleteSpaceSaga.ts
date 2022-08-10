import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setDeleteSpaceFailureResponseAction, setDeleteSpaceSuccessResponseAction } from '../actions/spaceActions';
import { IDeleteSpacePayload } from '../reducers/spaceReducer';

const deleteSpace = ({ spaceId }: IDeleteSpacePayload): Promise<IServerResponse> => {
    return httpRequester.delete(`${ApiUrl.SPACES}/${spaceId}`);
};

function* deleteSpaceWorker(action: IAction): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(deleteSpace, action.payload);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setDeleteSpaceSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setDeleteSpaceFailureResponseAction(err as IServerResponse));
    }
}
export function* watchDeleteSpaceSaga(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.DELETE_SPACE, deleteSpaceWorker);
}
