import { all } from '@redux-saga/core/effects';
import { watchFetchCitiesBySearchPattern } from './fetchCitiesBySearchPatternSaga';
import { watchFetchCurrentUser } from './fetchCurrentUserSaga';
import { watchFetchSpaceById } from './fetchSpaceByIdSaga';
import { watchFetchSpaces } from './fetchSpacesSaga';
import { watchFetchUserLoginState } from './fetchUserLoginStateSaga';
import { watchFetchUserSpaces } from './fetchUserSpacesSaga';
import { watchPostCheckVerificationCode } from './postCheckVerificationCodeSaga';
import { watchPostLogin } from './postLoginUserSaga';
import { watchPostLogoutUser } from './postLogoutUserSaga';
import { watchPostProvideSpace } from './postProvideSpaceSaga';
import { watchPostSendVerificationCode } from './postSendVerificationCodeSaga';
import { watchPostSignup } from './postSignupUserSaga';
import { watchPostUploadSpaceImages } from './postUploadSpaceImagesSaga';

export function* rootSaga() {
    // NOTE probably will need to fork all these if we do this on the page loading
    yield all([
        watchPostLogin(),
        watchPostSignup(),
        watchPostLogoutUser(),
        watchPostSendVerificationCode(),
        watchPostCheckVerificationCode(),
        watchPostProvideSpace(),
        watchPostUploadSpaceImages(),
        watchFetchSpaces(),
        watchFetchUserLoginState(),
        watchFetchCitiesBySearchPattern(),
        watchFetchSpaceById(),
        watchFetchUserSpaces(),
        watchFetchCurrentUser(),
    ]);
}
