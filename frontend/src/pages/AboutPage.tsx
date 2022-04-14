import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavTabs, { INavTab } from '../components/NavTabs';
import Titles from '../components/Titles';
import AboutRoutes from '../routes/AboutRoutes';
import { checkIfRouteNeedsRedirectingToChildRoute } from '../utils/utilFunctions';

export default function AboutPage(): JSX.Element {
    const navTabs: INavTab[] = [
        {
            name: 'О Spaceboo',
            linkTo: 'general',
        },
        {
            name: 'Миссия',
            linkTo: 'mission',
        },
        {
            name: 'Видение',
            linkTo: 'vision',
        },
    ];
    const pathname = window.location.pathname;
    const navigate = useNavigate();
    const redirectIfRouteIsNotSpecifiedOnInit = (): void => {
        const parentRoute = '/about';

        if (checkIfRouteNeedsRedirectingToChildRoute(pathname, parentRoute)) {
            navigate('/about/general');
        }
    };
    const applyEffectsOnInit = (): void => {
        redirectIfRouteIsNotSpecifiedOnInit();
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div className="page about-page">
            <Titles heading="О нас" paragraph="Здесь вы можете узнать кто мы." />
            <NavTabs tabs={navTabs} />
            <section className="about-content">
                <div className="about-content__box">
                    <AboutRoutes />
                </div>
            </section>
        </div>
    );
}
