import { IQueryData } from '../../components/Filters';
import { IServerResponse, ReduxSpaceActions, SagaTasks } from '../../types/types';
import { IEditSpaceData, IProvideSpaceData } from '../reducers/spaceReducer';
import { IAction } from './ActionTypes';

export const requestSpacesAction = (payload?: IQueryData): IAction<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_SPACES,
        payload,
    };
};

export const postProvideSpaceAction = (): IAction<SagaTasks> => {
    return {
        type: SagaTasks.POST_PROVIDE_SPACE,
    };
};

export const fetchSpacesSuccessAction = (payload: IServerResponse): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACES_SUCCESS_RESPONSE,
        payload,
    };
};

export const fetchSpacesFailureAction = (payload: IServerResponse): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACES_FAILURE_RESPONSE,
        payload,
    };
};

export const setProvideSpaceDataAction = (payload: IProvideSpaceData): IAction<ReduxSpaceActions> => {
    return {
        type: ReduxSpaceActions.SET_PROVIDE_SPACE_DATA,
        payload,
    };
};

export const setEditSpaceDataAction = (payload: IEditSpaceData): IAction<ReduxSpaceActions> => {
    return {
        type: ReduxSpaceActions.SET_EDIT_SPACE_DATA,
        payload,
    };
};

export const setProvideSpaceSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_POST_PROVIDE_SPACE_SUCCESS_RESPONSE,
        payload,
    };
};

export const setProvideSpaceFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_POST_PROVIDE_SPACE_FAILURE_RESPONSE,
        payload,
    };
};
