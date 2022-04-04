import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import LoginModal from '../modals/LoginModal';
import SignupModal from '../modals/SignupModal';
import { annualizeFetchLogoutResponseAction, fetchUserLoginStateAction } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { UrlPathname } from '../types/types';
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
    const getLinkForProvideSpaceButton = (): UrlPathname => {
        if (userLoginState?.loggedIn && !userLoginState?.confirmed) {
            return UrlPathname.HOME;
        }

        return UrlPathname.PROVIDE_SPACE;
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
                        mainDivClassName="navbar__login navbar-elem navbar-elem--4"
                        defineActiveClassName={defineActiveClassName}
                        handleActiveTab={handleActiveTab}
                    />
                    <div className="navbar__separator navbar-elem navbar-elem--5">
                        <h3 className="heading heading--tertiary"> | </h3>
                    </div>
                    <SignupModal
                        mainDivClassName="navbar__signup navbar-elem navbar-elem--6"
                        defineActiveClassName={defineActiveClassName}
                        handleActiveTab={handleActiveTab}
                    />
                </>
            );
        }
    };
    const renderAuthTabsLeadingToPages = (): JSX.Element | void => {
        if (
            (location.pathname === UrlPathname.LOGIN || location.pathname === UrlPathname.SIGNUP) &&
            !userLoginState?.loggedIn
        ) {
            return (
                <>
                    <NavLink to={UrlPathname.LOGIN} className="navbar-link">
                        <div
                            className={`heading heading--tertiary ${defineActiveClassName('login')}`}
                            onClick={handleActiveTab('login')}
                        >
                            Войти
                        </div>
                    </NavLink>
                    <div className="navbar__separator navbar-elem navbar-elem--5">
                        <h3 className="heading heading--tertiary"> | </h3>
                    </div>
                    <NavLink to={UrlPathname.SIGNUP} className="navbar-link">
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
                    className="navbar__user navbar-elem navbar-elem--4"
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

    // NOTE hereafter we will wrap a flex item in a div in order to be able to move without making position absolute
    return (
        <nav className="navbar">
            <NavLink to={UrlPathname.HOME} className="navbar-link">
                <object id="logo" data="/logo.svg" aria-labelledby={'logo'} />
            </NavLink>
            <div className="navbar__city-picker navbar-elem navbar-elem--1">
                <CityPicker
                    mainDivClassName=""
                    defineActiveClassName={defineActiveClassName}
                    handleActiveTab={handleActiveTab}
                />
            </div>
            <div className="navbar__how-it-works navbar-elem navbar-elem--2">
                <div id="how-it-works">
                    <NavLink
                        to={UrlPathname.HOW_IT_WORKS}
                        className={`navbar-link`}
                        onClick={handleActiveTab('how-it-works')}
                    >
                        Как это работает?
                    </NavLink>
                </div>
            </div>
            <div className="navbar__create-space navbar-elem navbar-elem--3">
                <NavLink to={getLinkForProvideSpaceButton()} className="navbar-link">
                    <AltButton mainDivClassName="primary" buttonText="Предоставить пространство" />
                </NavLink>
            </div>
            {renderAuthTabsOpeningModals()}
            {renderAuthTabsLeadingToPages()}
            {renderUserAvatarOrInitals()}
        </nav>
    );
}
