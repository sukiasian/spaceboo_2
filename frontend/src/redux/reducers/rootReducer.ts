import { combineReducers, Reducer } from 'redux';
import { authReducer, IAuthState } from './authReducer';
import { ISpaceState, spaceReducer } from './spaceReducer';
import { cityReducer, ICityState } from './cityReducer';
import { IModalState, modalReducer } from './modalReducer';
import { emailVerificationReducer, IEmailVerificationState } from './emailVerificationReducer';
import { commonReducer, ICommonState } from './commonReducer';
import { IUserState, userReducer } from './userReducer';
import { IImageState, imageReducer } from './imageReducer';
import { appointmentReducer, IAppointmentState } from './appointmentReducer';

export interface IReduxState {
    spaceStorage: ISpaceState;
    appointmentStorage: IAppointmentState;
    authStorage: IAuthState;
    userStorage: IUserState;
    imageStorage: IImageState;
    cityStorage: ICityState;
    modalStorage: IModalState;
    emailVerificationStorage: IEmailVerificationState;
    commonStorage: ICommonState;
}

const rootReducer: Reducer<IReduxState> = combineReducers({
    spaceStorage: spaceReducer,
    appointmentStorage: appointmentReducer,
    authStorage: authReducer,
    userStorage: userReducer,
    imageStorage: imageReducer,
    cityStorage: cityReducer,
    modalStorage: modalReducer,
    emailVerificationStorage: emailVerificationReducer,
    commonStorage: commonReducer,
});

export default rootReducer;
