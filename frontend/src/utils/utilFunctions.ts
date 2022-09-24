import { Dispatch, FormEventHandler, MouseEventHandler } from 'react';
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

export const defineActiveClassName = (activeTab: string | number, tab: string | number): string => {
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

interface IBeginningDate {
    year: string;
    month: string;
}

interface IEndingDate {
    year: string;
    month: string;
    lastDayOfMonth: string;
}

export const createDateRangeWithTimestamp = (year: number, month: number, lastDayOfMonth: number): string => {
    if (month < 10) {
        return `[${year}-0${month}-01T14:00:00.000Z, ${year}-0${month}-${lastDayOfMonth}T14:00:00.000Z]`;
    }

    return `[${year}-${month}-01T14:00:00.000Z, ${year}-${month}-${lastDayOfMonth}T14:00:00.000Z]`;
};

export const turnOffScrollingOnInit = (): (() => void) => {
    var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

    const preventDefault = (e: Event) => {
        e.preventDefault();
    };

    function preventDefaultForScrollKeys(e: any) {
        // @ts-ignore
        if (keys[e.keyCode]) {
            e.preventDefault(e);
            return false;
        }
    }

    let supportsPassive = false;

    try {
        // @ts-ignore
        window.addEventListener(
            'test',
            null,
            Object.defineProperty({}, 'passive', {
                get: function () {
                    supportsPassive = true;
                },
            })
        );
    } catch (e) {}

    const wheelOpt = supportsPassive ? { passive: false } : false;
    const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

    // call this to Disable
    const disableScroll = (): void => {
        window.addEventListener('DOMMouseScroll', preventDefault, false);
        window.addEventListener(wheelEvent, preventDefault, wheelOpt);
        window.addEventListener('touchmove', preventDefault, wheelOpt);
        window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    };

    const enableScroll = (): void => {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.removeEventListener(wheelEvent, preventDefault);
        window.removeEventListener('touchmove', preventDefault);
        window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    };

    disableScroll();

    return () => {
        enableScroll();
    };
};

export const isMobile = (): boolean => {
    return window.innerWidth <= 600 ?? false;
};

export const stopPropagation: MouseEventHandler = (e) => {
    e.stopPropagation();
};
