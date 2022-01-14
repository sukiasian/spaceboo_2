import { CallEffect, PutEffect, call, ForkEffect, takeEvery } from '@redux-saga/core/effects';
import { ApiUrls, SagaTasks, TServerResponse } from '../../types/types';
import { httpRequester } from '../../utils/HttpRequest';
import { IAction } from '../actions/ActionTypes';

// const postImages = (images: any): Promise<TServerResponse> => {
//     const headers: HeadersInit = { 'Content-Type': 'multipart/form-data'}

//     return httpRequester.post(ApiUrls.IMAGES, {

//     });
// };

// function* postImagesWorker(action: IAction<Redux>): Generator<CallEffect<TServerResponse> | PutEffect<IAction>> {
//     const payload = yield call(fetchCities, action.payload);

//     yield put();
// }
// export function* watchPostImages(): Generator<ForkEffect, void, void> {
//     yield takeEvery(SagaTasks.REQUEST_CITIES, citiesWorker);
// }
