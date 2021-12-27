import { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import LoginModal from '../modals/LoginModal';
import SignupModal from '../modals/SignupModal';
import { IReduxState } from '../redux/reducers/rootReducer';
import CityPicker from './CityPicker';

// FIXME нам нужно разделить логику так чтобы Город был отдельным элементом со всем вытекающим (<City />)
export default function Navbar(): ReactElement {
    const { userIsLoggedIn } = useSelector((state: IReduxState) => state.authStorage);

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
                    hello
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
