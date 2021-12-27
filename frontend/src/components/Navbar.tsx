import { ReactElement, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LoginModal from '../modals/LoginModal';
import SignupModal from '../modals/SignupModal';
import { requestUserIsLoggedInAction, requestUserLogoutAction } from '../redux/actions/authActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { AlertType } from '../types/types';
import Alert from './Alert';
import CityPicker from './CityPicker';

// FIXME нам нужно разделить логику так чтобы Город был отдельным элементом со всем вытекающим (<City />)
export default function Navbar(): ReactElement {
    const { userIsLoggedIn, logoutResponse } = useSelector((state: IReduxState) => state.authStorage);
    const dispatch = useDispatch();
    const handleLogout = (): void => {
        dispatch(requestUserLogoutAction());
    };
    const refreshUserLoggedInAfterLogout = (): void => {
        dispatch(requestUserIsLoggedInAction());
    };
    const renderLogoutError = (): JSX.Element | void => {
        if (logoutResponse && logoutResponse.error) {
            return <Alert alertType={AlertType.FAILURE} alertMessage={logoutResponse.error.message} />;
        }
    };

    useEffect(refreshUserLoggedInAfterLogout, [logoutResponse, dispatch]);

    return (
        <nav className="navbar">
            <div className="navbar__logo navbar-elem--0">
                <NavLink to="/">
                    <img src="" alt="logo" className="Логотип" />
                </NavLink>
            </div>
            <CityPicker mainDivClassName="navbar__city-picker navbar-elem--1" />
            <div className="navbar__how-it-works navbar-elem--2">
                <NavLink to="/how-it-works">
                    <h3 className="heading heading--tertiary"> Как это работает? </h3>
                </NavLink>
            </div>
            <div className="navbar__create-space navbar-elem--3">
                <NavLink to="/provide-space">
                    <h3 className="heading heading--tertiary"> Предоставить пространство </h3>
                </NavLink>
            </div>

            {userIsLoggedIn ? (
                <div className="navbar__user navbar-elem--4">
                    <img className="navbar__user-avatar" src="" alt="" />
                    <div onClick={handleLogout}> logout </div>
                    {renderLogoutError()}
                </div>
            ) : (
                <>
                    <LoginModal mainDivClassName="navbar__login navbar-elem--4" />
                    <div className="navbar__separator navbar-elem--5">
                        <h3 className="heading heading--tertiary"> | </h3>
                    </div>
                    <SignupModal mainDivClassName="navbar__signup navbar-elem--6" />
                </>
            )}
        </nav>
    );
}
