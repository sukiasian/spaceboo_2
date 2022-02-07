import { combineReducers, Reducer } from 'redux';
import { authReducer, IAuthState } from './authReducer';
import { ISpaceState, spaceReducer } from './spaceReducer';
import { cityReducer, ICityState } from './cityReducer';
import { IModalState, modalReducer } from './modalReducer';
import { emailVerificationReducer, IEmailVerificationState } from './emailVerificationReducer';
import { commonReducer, ICommonState } from './commonReducer';
import { IUserState, userReducer } from './userReducer';

export interface IReduxState {
    spaceStorage: ISpaceState;
    authStorage: IAuthState;
    userStorage: IUserState;
    cityStorage: ICityState;
    modalStorage: IModalState;
    emailVerificationStorage: IEmailVerificationState;
    commonStorage: ICommonState;
}

const rootReducer: Reducer<IReduxState> = combineReducers({
    spaceStorage: spaceReducer,
    authStorage: authReducer,
    userStorage: userReducer,
    cityStorage: cityReducer,
    modalStorage: modalReducer,
    emailVerificationStorage: emailVerificationReducer,
    commonStorage: commonReducer,
});

export default rootReducer;
