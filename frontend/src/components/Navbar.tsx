import { ReactElement, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import LoginModal from '../modals/LoginModal';
import SignupModal from '../modals/SignupModal';
import { annualizeLogoutResponse, requestUserLoginState, requestUserLogoutAction } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { AlertTypes, HttpStatus, UrlPathnames } from '../types/types';
import Alert from './Alert';
import AltButton from './AltButton';
import CityPicker from './CityPicker';

export default function Navbar(): ReactElement {
    const [activeTab, setActiveTab] = useState<string>();
    const { userLoginState, logoutResponse } = useSelector((state: IReduxState) => state.authStorage);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigateProvideSpace = (): UrlPathnames => {
        if (userLoginState.loggedIn && !userLoginState.confirmed) {
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
    const refreshUserLoggedInAfterLogout = (): void => {
        if (logoutResponse && logoutResponse.statusCode === HttpStatus.OK) {
            dispatch(requestUserLoginState());
            dispatch(annualizeLogoutResponse());
        }
    };
    const handleLogout = (): void => {
        dispatch(requestUserLogoutAction());
    };
    const handleActiveTab = (tab: string): (() => void) => {
        return (): void => {
            setActiveTab(tab);
        };
    };
    const renderLogoutError = (): JSX.Element | void => {
        if (logoutResponse && logoutResponse.error) {
            return <Alert alertType={AlertTypes.FAILURE} alertMessage={logoutResponse.error.message} />;
        }
    };
    const renderAuthOrUser = (): JSX.Element => {
        if (userLoginState.loggedIn) {
            return (
                <div className="navbar__user navbar-elem--4">
                    <img className="navbar__user-avatar" src="" alt="" />
                    <div onClick={handleLogout}> logout </div>
                    {renderLogoutError()}
                </div>
            );
        }

        if (location.pathname === UrlPathnames.LOGIN || location.pathname === UrlPathnames.SIGNUP) {
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
    };

    useEffect(refreshUserLoggedInAfterLogout, [logoutResponse, dispatch]);

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
                <NavLink to={navigateProvideSpace()}>
                    <AltButton mainDivClassName="primary" buttonText="Предоставить пространство" />
                </NavLink>
            </div>

            {renderAuthOrUser()}
        </nav>
    );
}
