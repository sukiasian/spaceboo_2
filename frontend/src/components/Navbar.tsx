export default function Navbar() {
    let city = 'Город';

    return (
        <div className="navbar">
            <div className="navbar__logo navbar-elem--0">
                <img src="" alt="logo" />
            </div>
            <div className="navbar__city-picker navbar-elem--1">
                <h3> {city} </h3>
            </div>
            <div className="navbar__how-it-works navbar-elem--2">
                <h3> Как это работает? </h3>
            </div>
            <div className="navbar__create-space navbar-elem--3">
                <h3> Предоставить пространство </h3>
            </div>
            <div className="navbar__login navbar-elem--4">
                <h3> Войти </h3>
            </div>
            <div className="navbar__separator navbar-elem--5">
                <h3> | </h3>
            </div>
            <div className="navbar__signup navbar-elem--6">
                <h3> Зарегистрироваться </h3>
            </div>
        </div>
    );
}
