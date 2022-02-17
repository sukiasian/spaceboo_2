import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../redux/reducers/rootReducer';
import {
    annualizeFetchLogoutResponseAction,
    fetchUserLoginStateAction,
    postLogoutUserAction,
} from '../redux/actions/authActions';
import { useEffect } from 'react';
import { ITab } from '../types/types';
import { toggleMyAppointmentsFinalLocationIsDefined } from '../redux/actions/commonActions';

export default function UserDropdownMenu(): JSX.Element {
    const { fetchCurrentUserSuccessResponse } = useSelector((state: IReduxState) => state.userStorage);
    const { fetchLogoutUserSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const userData = fetchCurrentUserSuccessResponse?.data;
    const userFullName = userData ? `${userData!.name} ${userData!.surname}` : '';
    const dispatch = useDispatch();
    const setFinalLocationFalsy = () => {
        dispatch(toggleMyAppointmentsFinalLocationIsDefined());
    };
    const dropdownLinkableTabs: ITab[] = [
        {
            tabName: 'Мои пространства',
            className: '',
            linkTo: '/my-spaces',
        },
        {
            tabName: 'Мои бронирования',
            className: 'with-lower-border',
            linkTo: '/my-appointments/active',
            onClick: setFinalLocationFalsy,
        },
        {
            tabName: 'Настройки',
            className: 'with-lower-border',
            linkTo: '/user/settings/general',
        },
    ];
    const handleLogout = (): void => {
        dispatch(postLogoutUserAction());
    };
    const refreshUserLoggedInAfterLogout = (): void => {
        if (fetchLogoutUserSuccessResponse) {
            dispatch(fetchUserLoginStateAction());
            dispatch(annualizeFetchLogoutResponseAction());
        }
    };
    const renderTabs = (): JSX.Element[] => {
        return dropdownLinkableTabs.map((linkableTab, i: number) => {
            return (
                <NavLink
                    to={linkableTab.linkTo!}
                    className={`user-drop-down-menu__option user-drop-down-menu__option--${i + 1} ${
                        linkableTab.className
                    }`}
                    onClick={linkableTab.onClick ?? (() => {})}
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
            <div
                className="user-drop-down-menu__option user-drop-down-menu__option--0 with-lower-border"
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <p>{userFullName}</p>
            </div>
            {renderTabs()}
            <div
                className={`user-drop-down-menu__item user-drop-down-menu__item--${dropdownLinkableTabs.length}`}
                onClick={handleLogout}
            >
                <p className="paragraph">Выход</p>
            </div>
        </div>
    );
}
