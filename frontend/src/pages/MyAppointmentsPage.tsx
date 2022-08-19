import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NavTabs, { INavTab } from '../components/NavTabs';
import Titles from '../components/Titles';
import { IReduxState } from '../redux/reducers/rootReducer';
import MyAppointmentsPageRoutes from '../routes/MyAppointmentsPageRoutes';

export default function MyAppointmentsPage(): JSX.Element {
    const appointmentsClassificationLinkableTabs: INavTab[] = [
        {
            name: 'Прошедшие',
            linkTo: 'outdated',
        },
        {
            name: 'Активные',
            linkTo: 'active',
        },
        {
            name: 'Предстоящие',
            linkTo: 'upcoming',
        },
    ];
    const [activeTab, setActiveTab] = useState(appointmentsClassificationLinkableTabs[1].name);
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
    const renderTabsBar = (): JSX.Element => {
        return <NavTabs tabs={appointmentsClassificationLinkableTabs} />;
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div className="page my-appointments-page">
            <div className="page-box">
                <Titles heading="Мои бронирования" paragraph="Здесь можно управлять бронированиями." />
                <div className="type-of-appointments-tabs-bar">{renderTabsBar()}</div>
                <MyAppointmentsPageRoutes />
            </div>
        </div>
    );
}
