import { IQueryData } from '../../components/Filters';
import { ReduxSpaceActions, SagaTasks, IServerFailureResponse, IServerSuccessResponse } from '../../types/types';
import { IEditSpaceData, IProvideSpaceData } from '../reducers/spaceReducer';
import { IAction } from './ActionTypes';

export const requestSpacesAction = (payload?: IQueryData): IAction<SagaTasks> => {
    return {
        type: SagaTasks.REQUEST_SPACES,
        payload,
    };
};

export const fetchSpacesSuccessAction = (payload: IServerSuccessResponse): IAction<ReduxSpaceActions> => {
    return {
        type: ReduxSpaceActions.SET_FETCH_SPACES_SUCCESS_RESPONSE,
        payload,
    };
};

export const fetchSpacesFailureAction = (payload: IServerFailureResponse): IAction<ReduxSpaceActions> => {
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
