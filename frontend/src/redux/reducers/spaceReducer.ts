import { IQueryData } from '../../components/Filters';
import { IServerResponse, QueryDefaultValue, ReduxSpaceAction } from '../../types/types';
import { IAction } from '../actions/ActionTypes';

export interface IProvideSpaceData {
    address?: string;
    pricePerNight?: number;
    type?: SpaceType;
    description?: string;
    roomsNumber?: number;
    bedsNumber?: number;
    lockerConnected?: boolean;
    spaceImages?: Array<any>;
    cityId?: number;
    userId?: string;
}
export interface IEditSpaceData {
    address?: string;
    pricePerNight?: number;
    type?: SpaceType;
    description?: string;
    roomsNumber?: number;
    bedsNumber?: number;
    imagesUrl?: string[];
    cityId?: number;
    userId?: string;
}
export interface IEditSpacePayload {
    editSpaceData: IEditSpaceData;
    spaceId: string;
    spaceImagesToRemove?: string[];
}

export interface IDeleteSpacePayload {
    spaceId: string;
}

export interface ISpaceState {
    isLoaded: boolean;
    fetchSpacesQueryData: IQueryData;
    provideSpaceData?: IProvideSpaceData;
    editSpaceData?: IEditSpaceData;
    postProvideSpaceSuccessResponse?: IServerResponse;
    postProvideSpaceFailureResponse?: IServerResponse;
    fetchSpacesSuccessResponse?: any[];
    fetchSpacesFailureResponse?: IServerResponse;
    fetchSpaceByIdSuccessResponse?: IServerResponse;
    fetchSpaceByIdFailureResponse?: IServerResponse;
    fetchUserSpacesSuccessResponse?: IServerResponse;
    fetchUserSpacesFailureResponse?: IServerResponse;
    fetchSpacesByUserOutdatedAppointmentsSuccessResponse?: IServerResponse;
    fetchSpacesByUserOutdatedAppointmentsFailureResponse?: IServerResponse;
    fetchSpacesByUserActiveAppointmentsSuccessResponse?: IServerResponse;
    fetchSpacesByUserActiveAppointmentsFailureResponse?: IServerResponse;
    fetchSpacesByUserUpcomingAppointmentsSuccessResponse?: IServerResponse;
    fetchSpacesByUserUpcomingAppointmentsFailureResponse?: IServerResponse;
    fetchSpacesForKeyControlSuccessResponse?: IServerResponse;
    fetchSpacesForKeyControlFailureResponse?: IServerResponse;
    putEditSpaceSuccessResponse?: IServerResponse;
    putEditSpaceFailureResponse?: IServerResponse;
    deleteSpaceSuccessResponse?: IServerResponse;
    deleteSpaceFailureResponse?: IServerResponse;
}

export enum SpaceType {
    FLAT = 'Квартира',
    HOUSE = 'Жилой дом',
}

const initialProvideSpaceData = {
    type: SpaceType.FLAT,
    roomsNumber: 2,
    bedsNumber: 2,
    lockerConnected: false,
};
const initialFetchSpacesQueryData: IQueryData = {
    page: QueryDefaultValue.PAGE,
    limit: QueryDefaultValue.LIMIT,
    offset: QueryDefaultValue.OFFSET,
    cityId: localStorage.getItem('currentCityId') || '',
};

const initialState: ISpaceState = {
    isLoaded: false,
    provideSpaceData: initialProvideSpaceData,
    fetchSpacesQueryData: initialFetchSpacesQueryData,
};

export const spaceReducer = (state = initialState, action: IAction): ISpaceState => {
    switch (action.type) {
        case ReduxSpaceAction.SET_POST_PROVIDE_SPACE_SUCCESS_RESPONSE:
            return {
                ...state,
                postProvideSpaceSuccessResponse: action.payload,
            };

        case ReduxSpaceAction.SET_POST_PROVIDE_SPACE_FAILURE_RESPONSE:
            return {
                ...state,
                postProvideSpaceFailureResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchSpacesSuccessResponse: [...(state.fetchSpacesSuccessResponse || []), ...action.payload],
            };

        case ReduxSpaceAction.SET_DELETE_SPACE_SUCCESS_RESPONSE:
            return {
                ...state,
                deleteSpaceSuccessResponse: action.payload,
            };

        case ReduxSpaceAction.SET_DELETE_SPACE_FAILURE_RESPONSE:
            return {
                ...state,
                deleteSpaceFailureResponse: action.payload,
            };

        case ReduxSpaceAction.ANNUALIZE_FETCH_SPACES_RESPONSES:
            return {
                ...state,
                fetchSpacesSuccessResponse: [],
                fetchSpacesFailureResponse: undefined,
            };

        case ReduxSpaceAction.ANNUALIZE_DELETE_SPACE_RESPONSES:
            return {
                ...state,
                deleteSpaceSuccessResponse: undefined,
                deleteSpaceFailureResponse: undefined,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_FAILURE_RESPONSE:
            return {
                ...state,
                fetchSpacesFailureResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACE_BY_ID_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchSpaceByIdSuccessResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACE_BY_ID_FAILURE_RESPONSE:
            return {
                ...state,
                fetchSpaceByIdFailureResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_USER_SPACES_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchUserSpacesSuccessResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_USER_SPACES_FAILURE_RESPONSE:
            return {
                ...state,
                fetchUserSpacesFailureResponse: action.payload,
            };

        case ReduxSpaceAction.SET_POST_PROVIDE_SPACE_DATA:
            return {
                ...state,
                provideSpaceData: action.payload,
            };

        case ReduxSpaceAction.SET_PUT_EDIT_SPACE_DATA:
            return {
                ...state,
                editSpaceData: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_QUERY_DATA:
            return {
                ...state,
                fetchSpacesQueryData: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchSpacesByUserOutdatedAppointmentsSuccessResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_FAILURE_RESPONSE:
            return {
                ...state,
                fetchSpacesByUserOutdatedAppointmentsFailureResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchSpacesByUserActiveAppointmentsSuccessResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_FAILURE_RESPONSE:
            return {
                ...state,
                fetchSpacesByUserActiveAppointmentsFailureResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchSpacesByUserUpcomingAppointmentsSuccessResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_FAILURE_RESPONSE:
            return {
                ...state,
                fetchSpacesByUserUpcomingAppointmentsFailureResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_FOR_KEY_CONTROL_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchSpacesForKeyControlSuccessResponse: action.payload,
            };

        case ReduxSpaceAction.SET_FETCH_SPACES_FOR_KEY_CONTROL_FAILURE_RESPONSE:
            return {
                ...state,
                fetchSpacesForKeyControlFailureResponse: action.payload,
            };

        case ReduxSpaceAction.SET_PUT_EDIT_SPACE_SUCCESS_RESPONSE:
            return {
                ...state,
                putEditSpaceSuccessResponse: action.payload,
            };

        case ReduxSpaceAction.SET_PUT_EDIT_SPACE_FAILURE_RESPONSE:
            return {
                ...state,
                putEditSpaceFailureResponse: action.payload,
            };

        case ReduxSpaceAction.ANNUALIZE_PROVIDE_SPACE_DATA:
            return {
                ...state,
                provideSpaceData: initialProvideSpaceData,
            };

        case ReduxSpaceAction.ANNUALIZE_PROVIDE_SPACE_RESPONSES:
            return {
                ...state,
                postProvideSpaceSuccessResponse: undefined,
                postProvideSpaceFailureResponse: undefined,
            };

        case ReduxSpaceAction.ANNUALIZE_FETCH_SPACES_BY_USER_OUTDATED_APPOINTMENTS_RESPONSES:
            return {
                ...state,
                fetchSpacesByUserOutdatedAppointmentsSuccessResponse: undefined,
                fetchSpacesByUserOutdatedAppointmentsFailureResponse: undefined,
            };

        case ReduxSpaceAction.ANNUALIZE_FETCH_SPACES_BY_USER_ACTIVE_APPOINTMENTS_RESPONSES:
            return {
                ...state,
                fetchSpacesByUserActiveAppointmentsSuccessResponse: undefined,
                fetchSpacesByUserActiveAppointmentsFailureResponse: undefined,
            };

        case ReduxSpaceAction.ANNUALIZE_FETCH_SPACES_BY_USER_UPCOMING_APPOINTMENTS_RESPONSES:
            return {
                ...state,
                fetchSpacesByUserUpcomingAppointmentsSuccessResponse: undefined,
                fetchSpacesByUserUpcomingAppointmentsFailureResponse: undefined,
            };

        case ReduxSpaceAction.ANNUALIZE_FETCH_SPACES_QUERY_DATA:
            return {
                ...state,
                fetchSpacesQueryData: {
                    page: QueryDefaultValue.PAGE,
                    limit: QueryDefaultValue.LIMIT,
                    offset: QueryDefaultValue.OFFSET,
                    cityId: localStorage.getItem('currentCityId') || '',
                },
            };

        default: {
            return { ...state };
        }
    }
};
