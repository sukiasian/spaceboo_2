import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import { IReduxState } from '../redux/reducers/rootReducer';
import MyAppointmentsPageRoutes from '../routes/MyAppointmentsPageRoutes';
import { ITab } from '../types/types';
import { defineActiveClassName } from '../utils/utilFunctions';

export default function MyAppointmentsPage(): JSX.Element {
    const a = useSelector((state: IReduxState) => state.commonStorage);
    const appointmentsClassificationLinkableTabs: ITab[] = [
        {
            tabName: 'Прошедшие',
            linkTo: 'outdated',
        },
        {
            tabName: 'Активные',
            linkTo: 'active',
        },
        {
            tabName: 'Предстоящие',
            linkTo: 'upcoming',
        },
    ];
    const [activeTab, setActiveTab] = useState(appointmentsClassificationLinkableTabs[1].tabName);
    const { myAppointmentsFinalLocationIsDefined } = useSelector((state: IReduxState) => state.commonStorage);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const checkIfMyAppointmentsRouteIsNotSpecified = () => {
        return window.location.pathname === '/my-appointments' || window.location.pathname === '/my-appointments/';
    };
    const navigateToActiveAppointments = (): void => {
        if (checkIfMyAppointmentsRouteIsNotSpecified()) {
            navigate('active');
        }
    };
    const applyEffectsOnInit = (): void => {
        navigateToActiveAppointments();
    };
    const handleActiveTab = (tab: string): (() => void) => {
        return () => {
            setActiveTab(tab);
        };
    };
    const renderTabsBar = (): JSX.Element[] => {
        return appointmentsClassificationLinkableTabs.map((tab, i: number) => {
            return (
                <NavLink to={tab.linkTo!} key={i}>
                    <div
                        className={defineActiveClassName(activeTab, tab.tabName)}
                        onClick={handleActiveTab(tab.tabName)}
                    >
                        <p className="paragraph">{tab.tabName}</p>
                    </div>
                </NavLink>
            );
        });
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <section className="my-appointments-page-section">
            <div className="type-of-appointments-tabs-bar">{renderTabsBar()}</div>
            <MyAppointmentsPageRoutes />
        </section>
    );
}
