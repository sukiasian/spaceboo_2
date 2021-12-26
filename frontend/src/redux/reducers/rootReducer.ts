import { combineReducers, Reducer } from 'redux';
import { authReducer, IAuthState } from './authReducer';
import { ISpaceState, spaceReducer } from './spaceReducer';
import { cityReducer, ICityState } from './cityReducer';

export interface IReduxStorage {
    spaceStorage: ISpaceState;
    authStorage: IAuthState;
    cityStorage: ICityState;
}

const rootReducer: Reducer<IReduxStorage> = combineReducers({
    spaceStorage: spaceReducer,
    authStorage: authReducer,
    cityStorage: cityReducer,
});

export default rootReducer;
