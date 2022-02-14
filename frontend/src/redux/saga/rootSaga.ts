import { all } from '@redux-saga/core/effects';
import { watchFetchSpaces, watchPostProvideSpace, watchRequestSpaceById, watchRequestUserSpaces } from './spaceSaga';
import { watchFindCitiesBySearchPattern } from './citySaga';
import { watchAfetchUserLoginState, watchLogoutUser, watchPostLogin, watchPostSignup } from './authSaga';
import { watchCheckVerificationCode, watchSendVerificationCode } from './emailVerificationSaga';
import { watchPostUploadSpaceImages } from './imageSaga';
import { watchRequestCurrentUser } from './userSaga';

export function* rootSaga() {
    // NOTE probably will need to fork all these if we do this on the page loading
    yield all([
        watchFetchSpaces(),
        watchAfetchUserLoginState(),
        watchFindCitiesBySearchPattern(),
        watchPostLogin(),
        watchPostSignup(),
        watchLogoutUser(),
        watchSendVerificationCode(),
        watchCheckVerificationCode(),
        watchPostProvideSpace(),
        watchRequestSpaceById(),
        watchRequestUserSpaces(),
        watchRequestCurrentUser(),
        watchPostUploadSpaceImages(),
    ]);
}

// FIXME: guess the way is to put every saga in a separate  file (eeeeevery saga is a new file - watchPostLogin - in a new file; watchPostUploadSpaceImages - in a new file).
// so we will solve the issue of unreadability of the code.
