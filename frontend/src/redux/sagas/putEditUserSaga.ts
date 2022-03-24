import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrl, IServerResponse, SagaTask } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setPutEditUserFailureResponseAction, setPutEditUserSuccessResponseAction } from '../actions/userActions';
import { IEditUserData } from '../reducers/userReducer';

const putEditUser = async (editUserData: IEditUserData): Promise<IServerResponse> => {
    return httpRequester.put(ApiUrl.USERS, editUserData);
};

function* putEditUserWorker(
    action: IAction<SagaTask, IEditUserData>
): Generator<CallEffect | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(putEditUser, action.payload!);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPutEditUserSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPutEditUserFailureResponseAction(err as IServerResponse));
    }
}
export function* watchPutEditUser(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTask.PUT_EDIT_USER, putEditUserWorker);
}
