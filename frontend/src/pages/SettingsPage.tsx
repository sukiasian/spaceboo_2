import { NavLink, useNavigate } from 'react-router-dom';
import SettingsPageRoutes from '../routes/SettingsPageRoutes';
import { useEffect } from 'react';
import { ITab } from '../types/types';
import { checkIfRouteNeedsRedirectingToChildRoute } from '../utils/utilFunctions';

export default function SettingsPage(): JSX.Element {
    const settingsLinkableTabs: ITab[] = [
        {
            tabName: 'Основное',
            linkTo: 'general',
        },
        {
            tabName: 'Безопасность',
            linkTo: 'security',
        },
    ];

    const pathname = window.location.pathname;
    const navigate = useNavigate();
    const redirectIfRouteIsNotSpecifiedOnInit = (): void => {
        const parentRoute = '/user/settings';

        if (checkIfRouteNeedsRedirectingToChildRoute(pathname, parentRoute)) {
            navigate(`${parentRoute}/general`);
        }
    };
    const applyEffectsOnInit = (): void => {
        redirectIfRouteIsNotSpecifiedOnInit();
    };
    const defineActiveClassForLink = (linkTo: string): string => {
        if (window.location.pathname.includes(linkTo)) {
            return 'tab--active';
        }

        return '';
    };
    const renderLinkableTabs = (): JSX.Element[] => {
        return settingsLinkableTabs.map((tab, i: number) => {
            return (
                <NavLink to={tab.linkTo!} key={i}>
                    <div className={`settings-tab settings-tab--${i} ${defineActiveClassForLink(tab.linkTo!)}`}>
                        <h3 className="heading heading--tertiary paragraph--tab paragraph--settings-tab">
                            {tab.tabName}
                        </h3>
                    </div>
                </NavLink>
            );
        });
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <section className="dashboard settings-page">
            <div className="dashboard__navigation-panel settings-page__navigation-panel">
                <div className="side-bar">
                    <div className="navigation-panel__title">
                        <h3 className="heading heading--tertiary">Настройки</h3>
                    </div>
                    <div className="settings-page__linkable-tabs">{renderLinkableTabs()}</div>
                </div>
            </div>
            <div className="settings-page__interface">
                <SettingsPageRoutes />
            </div>
        </section>
    );
}
