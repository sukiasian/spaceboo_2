import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import HowItWorksLink from '../links/HowItWorksLink';
import { annualizeFetchLogoutResponseAction, fetchUserLoginStateAction } from '../redux/actions/authActions';
import { toggleLoginModalAction } from '../redux/actions/modalActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { UrlPathname } from '../types/types';
import AltButton from './AltButton';
import BurgerMenu from './BurgerMenu';
import CityPicker from './CityPicker';
import UserAvatarOrInitials from './UserAvatarOrInitials';
import UserDropdownMenu from './UserDropdownMenu';

export default function Navbar(): JSX.Element {
    const [activeTab, setActiveTab] = useState<string>();
    const [userDropdownMenuIsOpen, setUserDropdownMenuIsOpen] = useState(false);

    const { fetchUserLoginStateSuccessResponse, fetchLogoutUserSuccessResponse } = useSelector(
        (state: IReduxState) => state.authStorage
    );

    const userDropdownMenuRef = useRef(null);

    const location = useLocation();
    const dispatch = useDispatch();

    const userLoginState = fetchUserLoginStateSuccessResponse?.data;

    const getLinkForProvideSpaceButton = (): UrlPathname => {
        if (userLoginState?.loggedIn && !userLoginState?.confirmed) {
            return UrlPathname.HOME;
        }

        return UrlPathname.PROVIDE_SPACE;
    };
    const defineActiveClassNameForTab = (tab: string): string => {
        if (activeTab === tab) {
            return 'active';
        }

        return '';
    };
    const defineActiveClassNameForUserAvatarOrInitials = (): string => {
        return userDropdownMenuIsOpen ? 'active' : '';
    };

    const handleActiveTab = (tab: string): (() => void) => {
        return (): void => {
            setActiveTab(tab);
        };
    };

    const toggleLoginModal = (): void => {
        dispatch(toggleLoginModalAction());
    };
    const handleLoginButton = (): void => {
        toggleLoginModal();
        handleActiveTab!('login');
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
    const closeUserDropdownMenuWhenClickingOutside = () => {
        document.onclick = (e) => {
            if (userDropdownMenuIsOpen && e.target !== userDropdownMenuRef.current) {
                handleToggleUserDropdownMenu();
            }
        };
    };

    // TODO: решить где это будет - всплывающее уведомление как отдельный тип уведомлений.
    const renderLoginTextButton = (): JSX.Element | null => {
        return !userLoginState?.loggedIn ? (
            <div className="navbar__elem login-container" onClick={handleLoginButton}>
                Войти
            </div>
        ) : null;
    };
    const renderAuthTabsLeadingToPages = (): JSX.Element | void => {
        if (
            !userLoginState?.loggedIn &&
            (location.pathname === UrlPathname.LOGIN || location.pathname === UrlPathname.SIGNUP)
        ) {
            return (
                <div className="navbar__elem invisible--phone">
                    <NavLink to={UrlPathname.LOGIN} className="navbar-link">
                        <AltButton
                            buttonText="Войти"
                            mainDivClassName={`heading heading--tertiary ${defineActiveClassNameForTab('login')}`}
                            handleClick={handleActiveTab('login')}
                        />
                    </NavLink>
                </div>
            );
        }
    };
    const renderUserAvatarOrInitals = (): JSX.Element | void => {
        if (userLoginState?.loggedIn) {
            return (
                <div
                    className={`navbar__user navbar-elem navbar-elem--6 ${defineActiveClassNameForUserAvatarOrInitials()}`}
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

    useEffect(refreshUserLoggedInAfterLogout, [fetchLogoutUserSuccessResponse, dispatch]);
    useEffect(closeUserDropdownMenuWhenClickingOutside, [userDropdownMenuIsOpen]);
    useEffect(closeUserDropdownMenuWhenChangingLocation, [window.location.pathname]);

    // сначала нужно сделать здесь  проверку на то мобильное устройство или нет
    // затем нужно в стилях поменять - сделать прикладным бургер
    return (
        <>
            <section id="navbar-section" className="navbar-section">
                <nav id="navbar" className="navbar">
                    <div className="navbar__elem logo-container">
                        <NavLink to={UrlPathname.HOME} className="navbar-link">
                            <div
                                className="svg-container
                            "
                            >
                                <object id="logo" data="/logo.svg" aria-labelledby={'logo'} />
                            </div>
                        </NavLink>
                    </div>
                    <div className="navbar__elem city-picker-container invisible--phone">
                        <CityPicker
                            defineActiveClassName={defineActiveClassNameForTab}
                            handleActiveTab={handleActiveTab}
                        />
                    </div>
                    <div className="navbar__elem invisible--phone how-it-works-container">
                        <HowItWorksLink handleActiveTab={handleActiveTab('how-it-works')} />
                    </div>
                    <div className="navbar__elem provide-space-button-container">
                        <NavLink to={getLinkForProvideSpaceButton()} className="navbar-link">
                            <button className="button button--primary navbar-provide-space-button">
                                Предоставить пространство
                            </button>
                        </NavLink>
                    </div>
                    {renderLoginTextButton()}
                    {renderAuthTabsLeadingToPages()}
                    {renderUserAvatarOrInitals()}
                    {!userLoginState?.loggedIn ? (
                        <div className="navbar__elem burger-menu-container">
                            <BurgerMenu />
                        </div>
                    ) : null}
                </nav>
            </section>
            <div id="navbar-container-for-fixed" />
        </>
    );
}
