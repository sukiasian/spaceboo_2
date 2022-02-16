import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import MyAppointmentsPageRoutes from '../routes/MyAppointmentsPageRoutes';
import { IServerResponse, ReduxCommonActions } from '../types/types';

interface IAppointmentsClassificationTab {
    tabName: string;
    to: string;
}

export const checkIfSpacesAmountIsNull = (data?: any[]): boolean => {
    return data?.length === 0 ? true : false;
};

export default function MyAppointmentsPage(): JSX.Element {
    const appointmentsClassificationTabs: IAppointmentsClassificationTab[] = [
        {
            tabName: 'Прошедшие',
            to: 'outdated',
        },
        {
            tabName: 'Активные',
            to: 'active',
        },
        {
            tabName: 'Предстоящие',
            to: 'upcoming',
        },
    ];
    const [activeTab, setActiveTab] = useState(appointmentsClassificationTabs[1].tabName);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const navigateToActive = (): void => {
        if (window.location.pathname.includes('my-appointments')) {
            navigate('active');
        }
    };
    const applyEffectsOnInit = (): (() => void) => {
        navigateToActive();

        return () => {
            dispatch({ type: ReduxCommonActions.SET_MY_APPOINTMENTS_PAGE_IS_LOADED_TO_TRUE });
        };
    };
    const handleActiveTab = (tab: string): (() => void) => {
        return () => {
            setActiveTab(tab);
        };
    };
    const checkIfSpacesAmountIsNull = (response?: IServerResponse): boolean => {
        return response?.data.length > 0 ? false : true;
    };
    const renderTabsBar = (): JSX.Element[] => {
        return appointmentsClassificationTabs.map((tab, i: number) => {
            return (
                <NavLink to={tab.to} key={i}>
                    <div className="" onClick={handleActiveTab(tab.tabName)}>
                        {tab.tabName}
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
            {/* если роут === my-appointments то здесь тупо ничего не будет отображаться. Как решить эту проблему?
            
            1. в applyEffectsOnInit перекидывать в active откуда начать всю деятельность алгоритма
            2. использовать просто компонент active здесь - так можно будет будет при попадании на my-appointments иметь отображенным 
                actives
            
            */}
        </section>
    );
}
