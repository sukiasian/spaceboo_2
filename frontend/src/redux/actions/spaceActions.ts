import { IQueryData } from '../../components/Filters';
import { IServerResponse, ReduxSpaceAction, SagaTask } from '../../types/types';
import { IEditSpaceData, IEditSpacePayload, IProvideSpaceData } from '../reducers/spaceReducer';
import { IAction } from './ActionTypes';

export const postProvideSpaceAction = (payload: IProvideSpaceData): IAction<SagaTask, IProvideSpaceData> => {
    return {
        type: SagaTask.POST_PROVIDE_SPACE,
        payload,
    };
};

export const fetchSpacesAction = (payload?: IQueryData): IAction<SagaTask> => {
    return {
        type: SagaTask.FETCH_SPACES,
        payload,
    };
};

export const fetchSpaceByIdAction = (payload: string): IAction<SagaTask, string> => {
    return {
        type: SagaTask.FETCH_SPACE_BY_ID,
        payload,
    };
};

export const fetchUserSpacesAction = (): IAction<SagaTask> => {
    return {
        type: SagaTask.FETCH_USER_SPACES,
    };
};

export const fetchSpacesByUserOutdatedAppointmentsAction = (): IAction<SagaTask> => {
    return {
        type: SagaTask.FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS,
    };
};

export const fetchSpacesByUserActiveAppointmentsAction = (): IAction<SagaTask> => {
    return {
        type: SagaTask.FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS,
    };
};

export const fetchSpacesByUserUpcomingAppointmentsAction = (): IAction<SagaTask> => {
    return {
        type: SagaTask.FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS,
    };
};

export const putEditSpaceAction = (payload: IEditSpacePayload): IAction<SagaTask> => {
    return {
        type: SagaTask.PUT_EDIT_SPACE,
        payload,
    };
};

export const setPostProvideSpaceDataAction = (
    payload: IProvideSpaceData
): IAction<ReduxSpaceAction, IProvideSpaceData> => {
    return {
        type: ReduxSpaceAction.SET_POST_PROVIDE_SPACE_DATA,
        payload,
    };
};

export const setProvideSpaceSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_POST_PROVIDE_SPACE_SUCCESS_RESPONSE,
        payload,
    };
};

export const setProvideSpaceFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_POST_PROVIDE_SPACE_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchSpacesByUserOutdatedAppointmentsSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchSpacesByUserOutdatedAppointmentsFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchSpacesByUserActiveAppointmentsSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchSpacesByUserActiveAppointmentsFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchSpacesByUserUpcomingAppointmentsSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchSpacesByUserUpcomingAppointmentsFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchSpacesForKeyControlSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_FOR_KEY_CONTROL_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchSpacesForKeyControlFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_FOR_KEY_CONTROL_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchSpacesSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchSpacesFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchSpaceByIdSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACE_BY_ID_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchSpaceByIdFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACE_BY_ID_FAILURE_RESPONSE,
        payload,
    };
};

export const setFetchUserSpacesSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_USER_SPACES_SUCCESS_RESPONSE,
        payload,
    };
};

export const setFetchUserSpacesFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_USER_SPACES_FAILURE_RESPONSE,
        payload,
    };
};
// FIXME: probably here we will need to have response instead of payload in parameters

export const setFetchSpacesQueryDataAction = (queryData: IQueryData): IAction<ReduxSpaceAction, IQueryData> => {
    return {
        type: ReduxSpaceAction.SET_FETCH_SPACES_QUERY_DATA,
        payload: queryData,
    };
};

export const setPutEditSpaceDataAction = (payload: IEditSpaceData): IAction<ReduxSpaceAction, IEditSpaceData> => {
    return {
        type: ReduxSpaceAction.SET_PUT_EDIT_SPACE_DATA,
        payload,
    };
};

export const setPutEditSpaceSuccessResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_PUT_EDIT_SPACE_SUCCESS_RESPONSE,
        payload,
    };
};

export const setPutEditSpaceFailureResponseAction = (
    payload: IServerResponse
): IAction<ReduxSpaceAction, IServerResponse> => {
    return {
        type: ReduxSpaceAction.SET_PUT_EDIT_SPACE_FAILURE_RESPONSE,
        payload,
    };
};

export const annualizeProvideSpaceDataAction = (): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.ANNUALIZE_PROVIDE_SPACE_DATA,
    };
};

export const annualizeProvideSpaceResponsesAction = (): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.ANNUALIZE_PROVIDE_SPACE_RESPONSES,
    };
};

export const annualizeFetchSpacesForUserOutdatedAppointmentsResponsesAction = (): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.ANNUALIZE_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_RESPONSES,
    };
};

export const annualizeFetchSpacesForUserActiveAppointmentsResponsesAction = (): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.ANNUALIZE_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_RESPONSES,
    };
};

export const annualizeFetchSpacesForUserUpcomingAppointmentsResponsesAction = (): IAction<ReduxSpaceAction> => {
    return {
        type: ReduxSpaceAction.ANNUALIZE_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_RESPONSES,
    };
};
