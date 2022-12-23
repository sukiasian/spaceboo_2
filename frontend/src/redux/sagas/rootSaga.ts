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
import { watchDeleteSpaceSaga } from './deleteSpaceSaga';
import { watchFetchAppointmentsForMonthWorker } from './fetchAppointmentsForMonthSaga';
import { watchCreateAppointment } from './postCreateAppointmentSaga';
import { watchDeleteLockerRequestById } from './deleteLockerRequestByIdSaga';
import { watchFetchUnprocessedRequestsAmount } from './fetchUnprocessedRequestsAmountSaga';
import { watchPostPairLocker } from './postPairLockerSaga';
import { watchPostRequestLockerReturn } from './postRequestLockerReturnSaga';
import { watchPostRequestLocker } from './postRequestLockerSaga';
import { watchPostUnlockLocker } from './postUnlockLockerSaga';
import { watchDeleteUnpairLocker } from './deleteUnpairLockerSaga';
import { watchFetchLockerRequestsByQuery } from './fetchLockerRequestsByQuerySaga';
import { watchFetchLockersByQuery } from './fetchLockersByQuerySaga';

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
        watchDeleteUserAvatar(),
        watchDeleteCancelAppointment(),
        watchDeleteSpaceSaga(),
        watchFetchAppointmentsForMonthWorker(),
        watchCreateAppointment(),
        watchDeleteLockerRequestById(),
        watchFetchUnprocessedRequestsAmount(),
        watchPostPairLocker(),
        watchPostRequestLockerReturn(),
        watchPostRequestLocker(),
        watchPostUnlockLocker(),
        watchDeleteUnpairLocker(),
        watchFetchLockerRequestsByQuery(),
        watchFetchLockersByQuery(),
    ]);
}
