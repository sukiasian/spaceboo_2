import { RefObject, useEffect } from 'react';
import { EventKey } from '../types/types';

interface IProps {
    innerRef: RefObject<HTMLDivElement>;
    children: JSX.Element;
    handleHideComponent: (...props: any) => any;
}

export default function HideComponentOnOutsideClickOrEscapePress(props: IProps): JSX.Element {
    const { innerRef, handleHideComponent } = props;

    const closeComponentOnOutsideClick = (e: MouseEvent): void => {
        if (e.target !== innerRef.current) {
            handleHideComponent();
        }
    };
    const closeComponentOnEscapePress = (e: KeyboardEvent): void => {
        if (e.key === EventKey.ESCAPE) {
            handleHideComponent();
        }
    };
    const applyEventListeners = (): (() => void) => {
        document.addEventListener('click', closeComponentOnOutsideClick);
        document.addEventListener('keydown', closeComponentOnEscapePress);

        return () => {
            document.removeEventListener('click', closeComponentOnOutsideClick);
            document.removeEventListener('keydown', closeComponentOnEscapePress);
        };
    };

    useEffect(applyEventListeners);

    return props.children;
}
