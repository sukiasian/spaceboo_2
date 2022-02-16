import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import {
    fetchSpacesByUserActiveAppointments,
    fetchSpacesByUserOutdatedAppointments,
    fetchSpacesByUserUpcomingAppointments,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import MyAppointmentsPageRoutes from '../routes/MyAppointmentsPageRoutes';
import { IServerResponse } from '../types/types';

interface IAppointmentsClassificationTab {
    tabName: string;
    to: string;
}

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
    const {
        fetchSpacesByUserOutdatedAppointmentsSuccessResponse,
        fetchSpacesByUserOutdatedAppointmentsFailureResponse,
        fetchSpacesByUserActiveAppointmentsSuccessResponse,
        fetchSpacesByUserActiveAppointmentsFailureResponse,
        fetchSpacesByUserUpcomingAppointmentsSuccessResponse,
        fetchSpacesByUserUpcomingAppointmentsFailureResponse,
    } = useSelector((state: IReduxState) => state.spaceStorage);
    const dispatch = useDispatch();
    const fetchSpacesForUserOutdatedAppointments = (): void => {
        dispatch(fetchSpacesByUserOutdatedAppointments());
    };
    const fetchSpacesForUserActiveAppointments = (): void => {
        dispatch(fetchSpacesByUserActiveAppointments());
    };
    const fetchSpacesForUserUpcomingAppointments = (): void => {
        dispatch(fetchSpacesByUserUpcomingAppointments());
    };
    const applyEffectsOnInit = (): void => {
        // если есть активные то их отображает первыми.
        // если есть предстоящие но нет активных то отображает предстоящие.
        // если же есть только прошедшие
        fetchSpacesForUserOutdatedAppointments();
        fetchSpacesForUserActiveAppointments();
        fetchSpacesForUserUpcomingAppointments();

        // нужно navigate на определенный роут
        // если какой то из этих вальнулся то надо останавливаться
    };
    const handleActiveTab = (tab: string): (() => void) => {
        return () => {
            setActiveTab(tab);
        };
    };
    const checkIfSpacesAmountIsNull = (response?: IServerResponse): boolean => {
        return response?.data.length > 0 ? false : true;
    };
    const switchActiveTab = (): void => {
        if (checkIfSpacesAmountIsNull(fetchSpacesByUserActiveAppointmentsSuccessResponse)) {
            handleActiveTab('Предстоящие');
        } else if (checkIfSpacesAmountIsNull(fetchSpacesByUserUpcomingAppointmentsSuccessResponse)) {
            handleActiveTab('Прошедшие');
        }
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
    useEffect(switchActiveTab, []);

    return (
        <section className="my-appointments-page-section">
            <div className="type-of-appointments-tabs-bar">{renderTabsBar()}</div>
            <MyAppointmentsPageRoutes />
        </section>
    );
}
