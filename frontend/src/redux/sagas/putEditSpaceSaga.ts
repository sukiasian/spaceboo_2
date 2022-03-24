import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrl, IServerResponse, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setPutEditSpaceFailureResponseAction, setPutEditSpaceSuccessResponseAction } from '../actions/spaceActions';
import { IEditSpacePayload } from '../reducers/spaceReducer';

const putEditSpace = async ({ editSpaceData, spaceId }: IEditSpacePayload): Promise<IServerResponse> => {
    return httpRequester.put(`${ApiUrl.SPACES}/${spaceId}`, { spaceEditData: editSpaceData });
};

function* putEditSpaceWorker(
    action: IAction<SagaTask, IEditSpacePayload>
): Generator<CallEffect | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(putEditSpace, action.payload!);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPutEditSpaceSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPutEditSpaceFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPutEditSpace(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTask.PUT_EDIT_SPACE, putEditSpaceWorker);
}
