import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IHOC } from '../types/types';

export default function ScrollToTop({ children }: IHOC): JSX.Element | null {
    const { pathname } = useLocation();
    const scrollToTop = (): void => {
        window.scrollTo(0, 0);
    };

    useEffect(scrollToTop, [pathname]);

    return children || null;
}
