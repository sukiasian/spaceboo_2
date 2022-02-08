import { Dispatch, FormEventHandler } from 'react';
import { Action } from 'redux';
import { IAction } from '../redux/actions/ActionTypes';
import { HttpStatus, IServerResponse, ReduxModalActions } from '../types/types';

export const toggleLoginOrSignupModal = (
    actionForOpeningModal: () => Action<ReduxModalActions>,
    actionForClosingModal: () => Action<ReduxModalActions>,
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

export const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
};

export const serverResponseIsSuccessful = (response: IServerResponse): boolean => {
    return response.statusCode >= HttpStatus.OK && response.statusCode < HttpStatus.AMBIGUOUS ? true : false;
};
