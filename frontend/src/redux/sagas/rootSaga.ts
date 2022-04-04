import { all } from '@redux-saga/core/effects';
import { watchFetchCitiesBySearchPattern } from './fetchCitiesBySearchPatternSaga';
import { watchFetchCurrentUser } from './fetchCurrentUserSaga';
import { watchFetchSpaceById } from './fetchSpaceByIdSaga';
import { watchFetchSpaces } from './fetchSpacesSaga';
import { watchFetchUserActiveAppointments } from './fetchSpacesByActiveUserAppointmentsSaga';
import { watchFetchUserOutdatedAppointments } from './fetchSpacesByOutdatedUserAppointmentsSaga';
import { watchFetchUserUpcomingAppointments } from './fetchSpacesByUpcomingUserAppointmentsSaga';
import { watchFetchUserLoginState } from './fetchUserLoginStateSaga';
import { watchFetchUserSpaces } from './fetchUserSpacesSaga';
import { watchPostCheckVerificationCode } from './postCheckVerificationCodeSaga';
import { watchPostLogin } from './postLoginUserSaga';
import { watchPostLogoutUser } from './postLogoutUserSaga';
import { watchPostProvideSpace } from './postProvideSpaceSaga';
import { watchPostSendVerificationCode } from './postSendVerificationCodeSaga';
import { watchPostSignup } from './postSignupUserSaga';
import { watchPostPasswordChange } from './postPasswordChangeSaga';
import { watchPostUploadUserAvatar } from './postUploadUserAvatarSaga';
import { watchDeleteUserAvatar } from './deleteUserAvatarSaga';
import { watchPutEditUser } from './putEditUserSaga';
import { watchPutEditSpace } from './putEditSpaceSaga';
import { watchDeleteCancelAppointment } from './deleteCancelAppointmentSaga';
import { watchFetchSpacesForKeyControl } from './fetchSpacesForKeyControlSaga';
import { watchToggleLocker } from './toggleLockerSaga';

export function* rootSaga() {
    yield all([
        watchPostLogin(),
        watchPostSignup(),
        watchPostLogoutUser(),
        watchPostSendVerificationCode(),
        watchPostCheckVerificationCode(),
        watchPostProvideSpace(),
        watchPostPasswordChange(),
        watchPostUploadUserAvatar(),
        watchFetchSpaces(),
        watchFetchUserLoginState(),
        watchFetchCitiesBySearchPattern(),
        watchFetchSpaceById(),
        watchFetchUserSpaces(),
        watchFetchCurrentUser(),
        watchFetchUserOutdatedAppointments(),
        watchFetchUserActiveAppointments(),
        watchFetchUserUpcomingAppointments(),
        watchFetchSpacesForKeyControl(),
        watchPutEditUser(),
        watchPutEditSpace(),
        watchToggleLocker(),
        watchDeleteUserAvatar(),
        watchDeleteCancelAppointment(),
    ]);
}
