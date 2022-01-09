import { Dispatch } from 'react';
import { Action } from 'redux';
import { IAction } from '../redux/actions/ActionTypes';
import { ReduxModalActions } from '../types/types';

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
