import { PutEffect, ForkEffect, CallEffect, call, put, takeLatest } from '@redux-saga/core/effects';
import { AnyAction } from 'redux';
import { ApiUrls, IServerResponse, SagaTasks } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { serverResponseIsSuccessful } from '../../utils/utilFunctions';
import { IAction } from '../actions/ActionTypes';
import { setPutEditUserFailureResponseAction, setPutEditUserSuccessResponseAction } from '../actions/userActions';
import { IEditUserData } from '../reducers/userReducer';

const putEditSpace = async (editUserData: IEditUserData, spaceId?: string): Promise<IServerResponse> => {
    return httpRequester.put(`${ApiUrls.SPACES}/${spaceId}`, editUserData);
};

function* putEditSpaceWorker(
    action: IAction<SagaTasks, IEditUserData>
): Generator<CallEffect | PutEffect<AnyAction>, void> {
    try {
        const response = yield call(putEditSpace, action.payload!);

        if (serverResponseIsSuccessful(response as IServerResponse)) {
            yield put(setPutEditUserSuccessResponseAction(response as IServerResponse));
        } else {
            throw response;
        }
    } catch (err) {
        yield put(setPutEditUserFailureResponseAction(err as IServerResponse));
    }
}
export function* watchEditSpace(): Generator<ForkEffect, void, void> {
    yield takeLatest(SagaTasks.PUT_EDIT_SPACE, putEditSpaceWorker);
}
