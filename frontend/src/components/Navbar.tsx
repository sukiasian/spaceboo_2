import { ReactElement } from 'react';
import { NavLink } from 'react-router-dom';
import CityPicker from './CityPicker';

interface INavbarState {}

// FIXME нам нужно разделить логику так чтобы Город был отдельным элементом со всем вытекающим (<City />)
export default function Navbar(): ReactElement {
    return (
        <nav className="navbar">
            <div className="navbar__logo navbar-elem--0">
                <NavLink to="/">
                    <img src="" alt="logo" className="logo" />
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
            <div className="navbar__login navbar-elem--4">
                <h3 className="heading heading--tertiary"> Войти </h3>
            </div>
            <div className="navbar__separator navbar-elem--5">
                <h3 className="heading heading--tertiary"> | </h3>
            </div>
            <div className="navbar__signup navbar-elem--6">
                <h3 className="heading heading--tertiary"> Зарегистрироваться </h3>
            </div>
        </nav>
    );
}
