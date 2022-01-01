import { Action } from 'redux';

export interface IAction<T = any, K = any> extends Action<T> {
    payload?: K;
}
