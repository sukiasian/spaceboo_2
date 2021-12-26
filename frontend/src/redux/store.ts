import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from '@redux-saga/core';
import rootReducer from './reducers/rootReducer';
import { rootSaga } from './saga/rootSaga';

const sagaMiddleware = createSagaMiddleware();

// use compose for devtools
export const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);
