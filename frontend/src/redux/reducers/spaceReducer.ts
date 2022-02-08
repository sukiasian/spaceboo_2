import { IQueryData } from '../../components/Filters';
import { IServerResponse, ReduxSpaceActions } from '../../types/types';
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
    spaceImages?: Array<any>;
    cityId?: number;
    userId?: string;
}
export interface ISpaceFormData {
    provideSpaceData?: IProvideSpaceData;
    editSpaceData?: IEditSpaceData;
}
export interface ISpaceState extends ISpaceFormData {
    isLoaded: boolean;
    fetchSpacesQueryData?: IQueryData;
    fetchSpacesSuccessResponse?: IServerResponse;
    fetchSpacesFailureResponse?: IServerResponse;
    fetchSpaceByIdSuccessResponse?: IServerResponse;
    fetchSpaceByIdFailureResponse?: IServerResponse;
    provideSpaceSuccessResponse?: IServerResponse;
    provideSpaceFailureResponse?: IServerResponse;
}

export enum SpaceType {
    FLAT = 'Квартира',
    HOUSE = 'Жилой дом',
}

const initialState: ISpaceState = {
    isLoaded: false,
    provideSpaceData: {
        type: SpaceType.FLAT,
        roomsNumber: 2,
        bedsNumber: 2,
        lockerConnected: false,
    },
};

export const spaceReducer = (state = initialState, action: IAction): ISpaceState => {
    switch (action.type) {
        case ReduxSpaceActions.SET_POST_PROVIDE_SPACE_SUCCESS_RESPONSE:
            return {
                ...state,
                provideSpaceSuccessResponse: action.payload,
            };

        case ReduxSpaceActions.SET_POST_PROVIDE_SPACE_FAILURE_RESPONSE:
            return {
                ...state,
                provideSpaceFailureResponse: action.payload,
            };

        case ReduxSpaceActions.SET_FETCH_SPACES_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchSpacesSuccessResponse: action.payload,
            };

        case ReduxSpaceActions.SET_FETCH_SPACES_FAILURE_RESPONSE:
            return {
                ...state,
                fetchSpacesFailureResponse: action.payload,
            };

        case ReduxSpaceActions.SET_FETCH_SPACE_BY_ID_SUCCESS_RESPONSE:
            return {
                ...state,
                fetchSpaceByIdSuccessResponse: action.payload,
            };

        case ReduxSpaceActions.SET_FETCH_SPACE_BY_ID_FAILURE_RESPONSE:
            return {
                ...state,
                fetchSpaceByIdFailureResponse: action.payload,
            };

        case ReduxSpaceActions.SET_PROVIDE_SPACE_DATA:
            return {
                ...state,
                provideSpaceData: action.payload,
            };

        case ReduxSpaceActions.SET_FETCH_SPACES_QUERY_DATA:
            return {
                ...state,
                fetchSpacesQueryData: action.payload,
            };

        default: {
            return { ...state };
        }
    }
};
