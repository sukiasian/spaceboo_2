import { Dispatch, FormEventHandler } from 'react';
import { Action } from 'redux';
import { IAction } from '../redux/actions/ActionTypes';
import { HttpStatus, IServerResponse, ReduxModalAction } from '../types/types';

export const toggleLoginOrSignupModal = (
    actionForOpeningModal: () => Action<ReduxModalAction>,
    actionForClosingModal: () => Action<ReduxModalAction>,
    dispatch: Dispatch<IAction>,
    loginModalIsOpen: boolean,
    signupModalIsOpen: boolean
): (() => void) => {
    return () => {
        if (!loginModalIsOpen && !signupModalIsOpen) {
            dispatch(actionForOpeningModal());
        } else {
            dispatch(actionForClosingModal());
            dispatch(actionForOpeningModal());
        }
    };
};

export const updateDocumentTitle = (title: string): void => {
    document.title = title;
};

export const formatSingleDigitUnitToTwoDigitString = (unit: number): string => {
    return unit > 9 ? `${unit}` : `0${unit}`;
};

export const valueIsNumeric = (targetValue: string): boolean => {
    const valueConsistsOfNotOnlyNumbers = targetValue.match(/[^0-9]/g);

    return valueConsistsOfNotOnlyNumbers || targetValue === '' ? false : true;
};

export const handleFormSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
};

export const serverResponseIsSuccessful = (response: IServerResponse): boolean => {
    return response.statusCode >= HttpStatus.OK && response.statusCode < HttpStatus.AMBIGUOUS ? true : false;
};

export const defineActiveClassName = (activeTab: string, tab: string): string => {
    if (activeTab === tab) {
        return 'active';
    }

    return '';
};

export const checkIfRouteNeedsRedirectingToChildRoute = (actualPathname: string, parentRoute: string): boolean => {
    return actualPathname === parentRoute || actualPathname === `${parentRoute}/`;
};

export const separateCityNameFromRegionIfCityNameContains = (cityName: string) => {
    const cityNameValuesSeparately = cityName.split(' ');

    return cityNameValuesSeparately[0];
};
