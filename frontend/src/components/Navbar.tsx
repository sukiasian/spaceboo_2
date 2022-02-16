import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import LoginModal from '../modals/LoginModal';
import SignupModal from '../modals/SignupModal';
import { annualizeLogoutResponseAction, fetchUserLoginStateAction } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { AlertTypes, UrlPathnames } from '../types/types';
import Alert from './Alert';
import AltButton from './AltButton';
import CityPicker from './CityPicker';
import UserDropdownMenu from './UserDropdownMenu';

export default function Navbar(): JSX.Element {
    const [activeTab, setActiveTab] = useState<string>();
    const [userDropdownMenuIsOpen, setUserDropdownMenuIsOpen] = useState(false);
    const { fetchUserLoginStateSuccessResponse, fetchLogoutUserSuccessResponse, fetchLogoutUserFailureResponse } =
        useSelector((state: IReduxState) => state.authStorage);
    const { fetchCurrentUserSuccessResponse } = useSelector((state: IReduxState) => state.userStorage);
    const userLoginState = fetchUserLoginStateSuccessResponse?.data;
    const userData = fetchCurrentUserSuccessResponse?.data;
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
            dispatch(annualizeLogoutResponseAction());
        }
    };

    // TODO: решить где это будет - всплывающее уведомление как отдельный тип.
    const renderLogoutError = (): JSX.Element | void => {
        if (fetchLogoutUserFailureResponse) {
            return <Alert alertType={AlertTypes.FAILURE} alertMessage={fetchLogoutUserFailureResponse.message!} />;
        }
    };
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
    const renderUserAvatarOrUserInitals = (): JSX.Element | void => {
        if (userLoginState?.loggedIn) {
            return (
                <div className="navbar__user navbar-elem--4" onClick={handleToggleUserDropdownMenu}>
                    {userData?.avatarUrl ? (
                        <div className="user-image user-image-or-initials">
                            <img src={userData.avatarUrl} alt="Пользователь" />
                        </div>
                    ) : (
                        <div className="user-no-image user-image-or-initials">
                            <div className="user-initials">
                                <p className="user-initials__last-name">
                                    {userData?.name?.[0]}
                                    {userData?.surname?.[0] as string}
                                </p>
                            </div>
                        </div>
                    )}
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
            {renderUserAvatarOrUserInitals()}
        </nav>
    );
}
