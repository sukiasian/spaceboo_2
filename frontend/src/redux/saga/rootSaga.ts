import { all } from '@redux-saga/core/effects';
import { watchFetchSpaces, watchPostProvideSpace } from './spaceSaga';
import { watchCities, watchFindCitiesBySearchPattern, watchFindMajorCities } from './citySaga';
import { watchAuth, watchLogoutUser, watchPostLogin, watchPostSignup } from './authSaga';
import { watchCheckVerificationCode, watchSendVerificationCode } from './emailVerificationSaga';
import { watchPostUploadSpaceImages } from './imageSaga';

export function* rootSaga() {
    // NOTE probably will need to fork all these if we do this on the page loading
    yield all([
        watchFetchSpaces(),
        watchCities(),
        watchAuth(),
        watchFindCitiesBySearchPattern(),
        watchPostLogin(),
        watchPostSignup(),
        watchLogoutUser(),
        watchSendVerificationCode(),
        watchCheckVerificationCode(),
        watchFindMajorCities(),
        watchPostProvideSpace(),
        watchPostUploadSpaceImages(),
    ]);
}
