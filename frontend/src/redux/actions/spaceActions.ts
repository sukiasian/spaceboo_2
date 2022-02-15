import { IQueryData } from '../../components/Filters';
import { IServerResponse, ReduxSpaceActions, SagaTasks } from '../../types/types';
import { IEditSpaceData, IProvideSpaceData } from '../reducers/spaceReducer';
import { IAction } from './ActionTypes';

export const postProvideSpaceAction = (payload: IProvideSpaceData): IAction<SagaTasks, IProvideSpaceData> => {
    return {
        type: SagaTasks.POST_PROVIDE_SPACE,
        payload,
    };
};

export const fetchSpacesAction = (payload?: IQueryData): IAction<SagaTasks> => {
    return {
        type: SagaTasks.FETCH_SPACES,
        payload,
    };
};

export const fetchSpaceByIdAction = (payload: string): IAction<SagaTasks, string> => {
    return {
        type: SagaTasks.FETCH_SPACE_BY_ID,
        payload,
    };
};

export const fetchUserSpaces = (): IAction<SagaTasks> => {
    return {
        type: SagaTasks.FETCH_USER_SPACES,
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

export const setPostProvideSpaceDataAction = (
    payload: IProvideSpaceData
): IAction<ReduxSpaceActions, IProvideSpaceData> => {
    return {
        type: ReduxSpaceActions.SET_POST_PROVIDE_SPACE_DATA,
        payload,
    };
};

export const setPutEditSpaceDataAction = (payload: IEditSpaceData): IAction<ReduxSpaceActions, IEditSpaceData> => {
    return {
        type: ReduxSpaceActions.SET_PUT_EDIT_SPACE_DATA,
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

export const setFetchSpaceByIdSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACE_BY_ID_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchSpaceByIdFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACE_BY_ID_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchUserSpacesSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_USER_SPACES_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchUserSpacesFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceActions, IServerResponse> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_USER_SPACES_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchSpacesQueryDataAction = (queryData: IQueryData): IAction<ReduxSpaceActions, IQueryData> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACES_QUERY_DATA,
        payload: queryData,
    };
};

export const annualizeProvideSpaceData = (): IAction<ReduxSpaceActions> => {
    return {
        type: ReduxSpaceActions.ANNUALIZE_PROVIDE_SPACE_DATA,
    };
};

export const annualizeProvideSpaceResponses = (): IAction<ReduxSpaceActions> => {
    return {
        type: ReduxSpaceActions.ANNUALIZE_PROVIDE_SPACE_RESPONSES,
    };
};
