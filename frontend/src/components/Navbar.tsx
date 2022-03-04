import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import LoginModal from '../modals/LoginModal';
import SignupModal from '../modals/SignupModal';
import { annualizeFetchLogoutResponseAction, fetchUserLoginStateAction } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { UrlPathnames } from '../types/types';
import AltButton from './AltButton';
import CityPicker from './CityPicker';
import UserAvatarOrInitials from './UserAvatarOrInitials';
import UserDropdownMenu from './UserDropdownMenu';

export default function Navbar(): JSX.Element {
    const [activeTab, setActiveTab] = useState<string>();
    const [userDropdownMenuIsOpen, setUserDropdownMenuIsOpen] = useState(false);
    const { fetchUserLoginStateSuccessResponse, fetchLogoutUserSuccessResponse } = useSelector(
        (state: IReduxState) => state.authStorage
    );
    const userLoginState = fetchUserLoginStateSuccessResponse?.data;
    const userDropdownMenuRef = useRef(null);
    const location = useLocation();
    const dispatch = useDispatch();
    const getLinkForProvideSpaceButton = (): UrlPathnames => {
        if (userLoginState?.loggedIn && !userLoginState?.confirmed) {
            return UrlPathnames.HOME;
        }

        return UrlPathnames.PROVIDE_SPACE;
    };
    const defineActiveClassName = (tab: string): string => {
        if (activeTab === tab) {
            return 'active';
        }

        return '';
    };
    const handleActiveTab = (tab: string): (() => void) => {
        return (): void => {
            setActiveTab(tab);
        };
    };
    const handleToggleUserDropdownMenu = (): void => {
        setUserDropdownMenuIsOpen(!userDropdownMenuIsOpen);
    };
    const refreshUserLoggedInAfterLogout = (): void => {
        if (fetchLogoutUserSuccessResponse) {
            dispatch(fetchUserLoginStateAction());
            dispatch(annualizeFetchLogoutResponseAction());
        }
    };
    const closeUserDropdownMenuWhenChangingLocation = (): void => {
        if (userDropdownMenuIsOpen) {
            handleToggleUserDropdownMenu();
        }
    };
    // TODO: решить где это будет - всплывающее уведомление как отдельный тип уведомлений.
    const renderAuthTabsOpeningModals = (): JSX.Element | void => {
        if (!userLoginState?.loggedIn) {
            return (
                <>
                    <LoginModal
                        mainDivClassName="navbar__login navbar-elem--4"
                        defineActiveClassName={defineActiveClassName}
                        handleActiveTab={handleActiveTab}
                    />
                    <div className="navbar__separator navbar-elem--5">
                        <h3 className="heading heading--tertiary"> | </h3>
                    </div>
                    <SignupModal
                        mainDivClassName="navbar__signup navbar-elem--6"
                        defineActiveClassName={defineActiveClassName}
                        handleActiveTab={handleActiveTab}
                    />
                </>
            );
        }
    };
    const renderAuthTabsLeadingToPages = (): JSX.Element | void => {
        if (
            (location.pathname === UrlPathnames.LOGIN || location.pathname === UrlPathnames.SIGNUP) &&
            !userLoginState?.loggedIn
        ) {
            return (
                <>
                    <NavLink to={UrlPathnames.LOGIN}>
                        <div
                            className={`heading heading--tertiary ${defineActiveClassName('login')}`}
                            onClick={handleActiveTab('login')}
                        >
                            Войти
                        </div>
                    </NavLink>
                    <div className="navbar__separator navbar-elem--5">
                        <h3 className="heading heading--tertiary"> | </h3>
                    </div>
                    <NavLink to={UrlPathnames.SIGNUP}>
                        <div
                            className={`heading heading--tertiary ${defineActiveClassName('signup')}`}
                            onClick={handleActiveTab('signup')}
                        >
                            Зарегистрируйтесь
                        </div>
                    </NavLink>
                </>
            );
        }
    };
    const renderUserAvatarOrInitals = (): JSX.Element | void => {
        if (userLoginState?.loggedIn) {
            return (
                <div
                    className="navbar__user navbar-elem--4"
                    onClick={handleToggleUserDropdownMenu}
                    ref={userDropdownMenuRef}
                >
                    <UserAvatarOrInitials />
                    {renderUserdropDownMenu()}
                </div>
            );
        }
    };
    const renderUserdropDownMenu = (): JSX.Element | void => {
        if (userDropdownMenuIsOpen) {
            return <UserDropdownMenu />;
        }
    };
    const closeUserDropdownMenuWhenClickingOutside = () => {
        document.onclick = (e) => {
            if (userDropdownMenuIsOpen && e.target !== userDropdownMenuRef.current) {
                handleToggleUserDropdownMenu();
            }
        };
    };

    useEffect(refreshUserLoggedInAfterLogout, [fetchLogoutUserSuccessResponse, dispatch]);
    useEffect(closeUserDropdownMenuWhenClickingOutside, [userDropdownMenuIsOpen]);
    useEffect(closeUserDropdownMenuWhenChangingLocation, [window.location.pathname]);

    return (
        <nav className="navbar">
            <div className="navbar__logo navbar-elem--0">
                <NavLink to={UrlPathnames.HOME}>
                    <img src="" alt="logo" className="logo" />
                </NavLink>
            </div>
            <CityPicker
                mainDivClassName="navbar__city-picker navbar-elem--1"
                defineActiveClassName={defineActiveClassName}
                handleActiveTab={handleActiveTab}
            />
            <div className="navbar__how-it-works navbar-elem--2">
                <NavLink to={UrlPathnames.HOW_IT_WORKS}>
                    <h3
                        className={`heading heading--tertiary ${defineActiveClassName('how-it-works')}`}
                        onClick={handleActiveTab('how-it-works')}
                    >
                        Как это работает?
                    </h3>
                </NavLink>
            </div>
            <div className="navbar__create-space navbar-elem--3">
                <NavLink to={getLinkForProvideSpaceButton()}>
                    <AltButton mainDivClassName="primary" buttonText="Предоставить пространство" />
                </NavLink>
            </div>
            {renderAuthTabsOpeningModals()}
            {renderAuthTabsLeadingToPages()}
            {renderUserAvatarOrInitals()}
        </nav>
    );
}
