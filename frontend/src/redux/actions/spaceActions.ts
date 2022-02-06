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

export const postProvideSpaceAction = (payload: IProvideSpaceData): IAction<SagaTasks, IProvideSpaceData> => {
    return {
        type: SagaTasks.POST_PROVIDE_SPACE,
        payload,
    };
};

export const requestSpaceByIdAction = (payload: string): IAction<SagaTasks, string> => {
    return {
        type: SagaTasks.REQUEST_SPACE_BY_ID,
        payload,
    };
};

export const setFetchSpacesSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACES_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchSpacesFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACES_FAILURE_RESPONSE,
        payload,
    };
};

export const setProvideSpaceDataAction = (
    payload: IProvideSpaceData
): IAction<ReduxSpaceActions, IProvideSpaceData> => {
    return {
        type: ReduxSpaceActions.SET_PROVIDE_SPACE_DATA,
        payload,
    };
};

export const setEditSpaceDataAction = (payload: IEditSpaceData): IAction<ReduxSpaceActions, IEditSpaceData> => {
    return {
        type: ReduxSpaceActions.SET_EDIT_SPACE_DATA,
        payload,
    };
};

export const setProvideSpaceSuccessResponseAction = (
    payload?: IServerResponse
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

export const setFetchSpaceByIdSuccessResponse = (
    payload: IServerResponse
): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACE_BY_ID_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchSpaceByIdFailureResponse = (
    payload: IServerResponse
): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACE_BY_ID_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchSpacesQueryData = (queryData: IQueryData): IAction<ReduxSpaceActions, IQueryData> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACES_QUERY_DATA,
        payload: queryData,
    };
};
