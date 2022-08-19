import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { IHOC } from '../types/types';

export default function ScrollToTop({ children }: IHOC): JSX.Element | null {
    const blackList = ['/how-it-works', 'user/settings/'];
    const { pathname } = useLocation();

    const isBlackListed = (): boolean => {
        for (const listElement of blackList) {
            if (pathname.includes(listElement)) {
                return true;
            }
        }

        return false;
    };
    const scrollToTop = (): void => {
        if (!isBlackListed()) {
            window.scrollTo(0, 0);
        }
    };

    useEffect(scrollToTop, [pathname]);

    return children || null;
}
