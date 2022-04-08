import { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import AltButton from '../components/AltButton';
import { updateDocumentTitle } from '../utils/utilFunctions';

export default function HowItWorksPage(): JSX.Element {
    const handleDocumentTitle = (): void => {
        updateDocumentTitle('Spaceboo | Как это работает?');
    };

    useEffect(handleDocumentTitle, []);

    return (
        <div className="how-it-works-page">
            <section className="banner">
                <header className="navbar banner__navbar">
                    <div className="logo--white" />
                    <NavLink to="/about-us">О нас</NavLink>
                    <NavLink to="/for-investors">Инвесторам</NavLink>
                </header>
                <div className="banner__texts">
                    <h1 className="heading heading--primary banner__texts__main">
                        Где можно заселиться в любое время.
                    </h1>
                    <p className="paragraph paragraph--large paragraph--white banner__texts__additional">
                        Там, где Spaceboo делает за вас всю работу.
                    </p>
                </div>
                <div className="calls-to-action">
                    <AltButton mainDivClassName="white" buttonText="Открыть пространства" />
                    <NavLink to="/provide-space">
                        <AltButton mainDivClassName="white" buttonText="Предоставить пространство" />
                    </NavLink>
                </div>
            </section>
            <section className="how-it-works__what-is-spaceboo-section">
                <div className="how-it-works__what-is-spaceboo__heading">
                    <h2 className="heading heading--secondary">Что такое Спейсбу?</h2>
                </div>
                <div className="how-it-works__what-is-spaceboo__image" />
            </section>
            <section className="how-it-works__how-spaceboo-works-section">
                <div className="how-it-works__how-spaceboo-works__headings">
                    <h2 className="heading heading--secondary">Как это работает?</h2>
                    <p className="paragraph paraghraph--medium">Все нереально просто!</p>
                </div>
                <div className="how-it-works__how-spaceboo-works__steps">
                    {/* Здесь лучше сделать роут который будет отображать согласњо выбранному */}
                    {/* Ставим 2 ссылки на роуты которые будут  */}
                </div>
            </section>
            <section className="how-it-works__why-spaceboo-section"></section>
        </div>
    );
}
