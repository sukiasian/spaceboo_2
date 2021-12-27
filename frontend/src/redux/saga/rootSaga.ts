import { all } from '@redux-saga/core/effects';
import { watchSpaces } from './spaceSaga';
import { watchCities, watchFindCitiesBySearchPattern } from './citySaga';
import { watchAuth, watchLogoutUser, watchPostLogin, watchPostSignup } from './authSaga';
// import { spaceSaga } from './spaceSaga';

export function* rootSaga() {
    // NOTE probably will need to fork all these if we do this on the page loading
    yield all([
        watchSpaces(),
        watchCities(),
        watchAuth(),
        watchFindCitiesBySearchPattern(),
        watchPostLogin(),
        watchPostSignup(),
        watchLogoutUser(),
    ]);
}
