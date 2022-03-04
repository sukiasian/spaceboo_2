import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { IReduxState } from '../redux/reducers/rootReducer';
import SettingsPageRoutes from '../routes/SettingsPageRoutes';
import { useEffect, useState } from 'react';
import { ITab } from '../types/types';

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
    const [activeTab, setActiveTab] = useState();
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const userLoginState = fetchUserLoginStateSuccessResponse?.data;
    const pathname = window.location.pathname;
    const navigate = useNavigate();
    const checkIfSettingsRouteIsNotSpecified = (): boolean => {
        return pathname !== '/user/settings/security' && pathname !== '/user/settings/security/';
    };
    const applyEffectsOnInit = (): void => {
        if (checkIfSettingsRouteIsNotSpecified()) {
            navigate('/user/settings/general');
        }
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
        <section className="settings-page">
            <div className="settings-page__navigation-panel">
                <div className="navigation-panel__title">
                    <h3 className="heading heading--tertiary">Настройки</h3>
                </div>
                {renderLinkableTabs()}
            </div>
            <div className="settings-page__interface">
                <SettingsPageRoutes />
            </div>
        </section>
    );
}
