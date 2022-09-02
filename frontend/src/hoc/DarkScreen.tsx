import { useEffect } from 'react';
import { EventKey } from '../types/types';

interface IDarkScreenProps {
    children: JSX.Element;
    handleCloseButtonClick: (...props: any) => any;
}

export default function DarkScreen({ handleCloseButtonClick, children }: IDarkScreenProps): JSX.Element {
    const closeOnEscapePress = (e: KeyboardEvent) => {
        if (e.key === EventKey.ESCAPE) {
            handleCloseButtonClick(e);
        }
    };

    const applyEffectsOnInit = (): (() => void) => {
        document.addEventListener('keydown', closeOnEscapePress);

        return () => {
            document.removeEventListener('keydown', closeOnEscapePress);
        };
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div
            className="dark-screen"
            onClick={(e) => {
                handleCloseButtonClick(e);
            }}
        >
            {children}
        </div>
    );
}
