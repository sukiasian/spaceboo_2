import { combineReducers, Reducer } from 'redux';
import { authReducer, IAuthState } from './authReducer';
import { ISpaceState, spaceReducer } from './spaceReducer';
import { cityReducer, ICityState } from './cityReducer';
import { IModalState, modalReducer } from './modalReducer';

export interface IReduxState {
    spaceStorage: ISpaceState;
    authStorage: IAuthState;
    cityStorage: ICityState;
    modalStorage: IModalState;
}

const rootReducer: Reducer<IReduxState> = combineReducers({
    spaceStorage: spaceReducer,
    authStorage: authReducer,
    cityStorage: cityReducer,
    modalStorage: modalReducer,
});

export default rootReducer;
