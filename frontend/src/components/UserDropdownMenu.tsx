import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../redux/reducers/rootReducer';
import {
    annualizeLogoutResponseAction,
    fetchUserLoginStateAction,
    postLogoutUserAction,
} from '../redux/actions/authActions';
import { useEffect } from 'react';

interface IDropdownLinkableTab {
    tabName: string;
    className: string;
    linkTo: string;
}

export default function UserDropdownMenu(): JSX.Element {
    const { fetchCurrentUserSuccessResponse } = useSelector((state: IReduxState) => state.userStorage);
    const { fetchLogoutUserSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const userData = fetchCurrentUserSuccessResponse!.data;
    const linkableTabs: IDropdownLinkableTab[] = [
        {
            tabName: `${userData!.name} ${userData!.surname}`,
            className: 'with-lower-border',
            linkTo: '/',
        },
        {
            tabName: 'Мои пространства',
            className: '',
            linkTo: '/my-spaces',
        },
        {
            tabName: 'Мои бронирования',
            className: 'with-lower-border',
            linkTo: '/my-appointments',
        },
    ];
    const dispatch = useDispatch();
    const handleLogout = (): void => {
        dispatch(postLogoutUserAction());
    };
    const refreshUserLoggedInAfterLogout = (): void => {
        if (fetchLogoutUserSuccessResponse) {
            dispatch(fetchUserLoginStateAction());
            dispatch(annualizeLogoutResponseAction());
        }
    };
    const renderLinkableTabs = (): JSX.Element[] => {
        return linkableTabs.map((linkableTab: IDropdownLinkableTab, i: number) => {
            return (
                <NavLink
                    to={linkableTab.linkTo}
                    className={`user-drop-down-menu__item user-drop-down-menu__item--${i} ${linkableTab.className}`}
                    key={i}
                >
                    <p className="paragraph">{linkableTab.tabName}</p>
                </NavLink>
            );
        });
    };

    useEffect(refreshUserLoggedInAfterLogout, [fetchLogoutUserSuccessResponse, dispatch]);

    return (
        <div className="user-drop-down-menu">
            {renderLinkableTabs()}
            <div
                className={`user-drop-down-menu__item user-drop-down-menu__item--${linkableTabs.length}`}
                onClick={handleLogout}
            >
                <p className="paragraph">Выход</p>
            </div>
        </div>
    );
}
