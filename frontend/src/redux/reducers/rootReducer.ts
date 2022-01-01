import { combineReducers, Reducer } from 'redux';
import { authReducer, IAuthState } from './authReducer';
import { ISpaceState, spaceReducer } from './spaceReducer';
import { cityReducer, ICityState } from './cityReducer';
import { IModalState, modalReducer } from './modalReducer';
import { emailVerificationReducer, IEmailVerificationState } from './emailVerificationReducer';

export interface IReduxState {
    spaceStorage: ISpaceState;
    authStorage: IAuthState;
    cityStorage: ICityState;
    modalStorage: IModalState;
    emailVerificationStorage: IEmailVerificationState;
}

const rootReducer: Reducer<IReduxState> = combineReducers({
    spaceStorage: spaceReducer,
    authStorage: authReducer,
    cityStorage: cityReducer,
    modalStorage: modalReducer,
    emailVerificationStorage: emailVerificationReducer,
});

export default rootReducer;
