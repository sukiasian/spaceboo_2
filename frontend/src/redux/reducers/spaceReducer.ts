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
    spaceImages?: FileList;
    cityId?: number;
    userId?: string;
}
export interface IEditSpaceData {
    address?: string;
    type?: SpaceType;
    description?: string;
    roomsNumber?: number;
    bedsNumber?: number;
    spaceImages?: FileList;
    cityId?: number;
    userId?: string;
}
export interface ISpaceFormData {
    provideSpaceData?: IProvideSpaceData;
    editSpaceData?: IEditSpaceData;
}
export interface ISpaceState extends ISpaceFormData {
    // spaces: Space[];
    isLoaded: boolean;
    spaces: any[];
    fetchSpacesSuccessResponse?: IServerResponse;
    fetchSpacesFailureResponse?: IServerResponse;
    provideSpaceSuccessResponse?: IServerResponse;
    provideSpaceFailureResponse?: IServerResponse;
}

export enum SpaceType {
    FLAT = 'Квартира',
    HOUSE = 'Жилой дом',
}

const initialState: ISpaceState = {
    isLoaded: false,
    spaces: [],
    provideSpaceData: {
        address: '',
        pricePerNight: 0,
        type: SpaceType.FLAT,
        description: '',
        roomsNumber: 2,
        bedsNumber: 2,
        lockerConnected: false,
    },
    editSpaceData: {
        address: '',
    },
};

export const spaceReducer = (state = initialState, action: IAction): ISpaceState => {
    switch (action.type) {
        case ReduxSpaceActions.FETCH_SPACES:
            return {
                ...state,
                spaces: action.payload,
            };

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

        case ReduxSpaceActions.SET_PROVIDE_SPACE_DATA:
            return {
                ...state,
                provideSpaceData: action.payload,
            };

        default: {
            return { ...state };
        }
    }
};
