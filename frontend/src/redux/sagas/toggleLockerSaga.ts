import { PutEffect, ForkEffect, CallEffect, call, put, takeEvery } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { IServerResponse, ApiUrl, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { setPutToggleLockerFailureResponse, setPutToggleLockerSuccessResponse } from '../actions/lockerActions';

const toggleLocker = (): Promise<IServerResponse> => {
    // NOTE: должно ли это делаться через Locker controller или через Space controller?
    return httpRequester.put(`${ApiUrl.LOCKER}/:lockerId/status`, {});
};

function* toggleLockerWorker(): Generator<CallEffect<any> | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(toggleLocker);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPutToggleLockerSuccessResponse(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPutToggleLockerFailureResponse(err as IServerResponse));
    }
}
export function* watchToggleLocker(): Generator<ForkEffect, void, void> {
    yield takeEvery(SagaTask.PUT_TOGGLE_LOCKER, toggleLockerWorker);
}
