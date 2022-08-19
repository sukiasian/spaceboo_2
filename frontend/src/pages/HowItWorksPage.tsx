import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import AltButton from '../components/AltButton';
import { IReduxState } from '../redux/reducers/rootReducer';
import HowItWorksRoutes from '../routes/HowItWorksRoutes';
import { updateDocumentTitle } from '../utils/utilFunctions';

export default function HowItWorksPage(): JSX.Element {
    const { howItWorksStepsUserChosen } = useSelector((state: IReduxState) => state.commonStorage);

    const navigate = useNavigate();

    const handleDocumentTitle = (): void => {
        updateDocumentTitle('Spaceboo | Как это работает?');
    };
    const annualizeUserIsChosenWhenLeavingPage = (): void => {
        // TODO: we need to set falsy when leaving the page
    };
    const hideMainNavbarOnInit = (): void => {
        document.getElementById('navbar')!.style.display = 'none';
    };
    const returnMainNavbarWhenLeaving = (): void => {
        document.getElementById('navbar')!.style.display = 'flex';
    };
    const applyEffectsOnInit = (): (() => void) => {
        handleDocumentTitle();
        hideMainNavbarOnInit();
        annualizeUserIsChosenWhenLeavingPage();

        return () => {
            returnMainNavbarWhenLeaving();
        };
    };

    const navigateToHome = (): void => {
        navigate('/');
    };

    const renderHintToChooseTypeOfUser = (): JSX.Element | void => {
        if (!howItWorksStepsUserChosen) {
            return (
                <div className="how-it-works-choose-user-hint">
                    Выберите тип пользователя — и мы расскажем подробнее.
                </div>
            );
        }
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div className="how-it-works-page">
            <section className="banner how-it-works__banner">
                <div className="how-it-works__banner__image">
                    <header className="banner__navbar">
                        <div className="logo--white" onClick={navigateToHome} />
                        <NavLink to="/about">О нас</NavLink>
                        <NavLink to="/for-investors">Инвесторам</NavLink>
                    </header>
                    <div className="how-it-works__banner__content">
                        <div className="banner__texts">
                            <div className="main">
                                <h1 className="heading heading--primary banner__texts__main">
                                    Где можно заселиться в любое время.
                                </h1>
                            </div>
                            <div className="additional">
                                <p className="paragraph paragraph--large paragraph--white banner__texts__additional">
                                    Там, где Spaceboo делает за вас всю работу.
                                </p>
                            </div>
                        </div>
                        <div className="calls-to-action">
                            <NavLink to={'/'}>
                                <AltButton mainDivClassName="white" buttonText="Открыть пространства" />
                            </NavLink>
                            <NavLink to="/provide-space">
                                <AltButton mainDivClassName="white" buttonText="Предоставить пространство" />
                            </NavLink>
                        </div>
                    </div>
                </div>
            </section>
            <section className="how-it-works-section how-it-works__what-is-spaceboo-section">
                <div className="how-it-works__what-is-spaceboo__heading">
                    <h2 className="heading heading--secondary">Что такое Спейсбу?</h2>
                </div>
                <div className="how-it-works__what-is-spaceboo__image" />
            </section>
            <section className="how-it-works-section how-it-works__how-spaceboo-works-section">
                <div className="how-it-works__how-spaceboo-works__headings">
                    <h2 className="heading heading--secondary">Как это работает?</h2>
                    <p className="paragraph paraghraph--medium">Все нереально просто!</p>
                </div>
                <div className="how-it-works__how-spaceboo-works__steps">
                    <div className="types-of-users">
                        <NavLink to="spaceowner">Я арендодатель</NavLink>
                        <NavLink to="spacetaker">Я арендатор</NavLink>
                    </div>
                    {renderHintToChooseTypeOfUser()}
                    <HowItWorksRoutes />
                </div>
            </section>
            <section className="how-it-works-section how-it-works__why-spaceboo-section">
                <div className="how-it-works__why-spaceboo__heading">
                    <h2 className="heading heading--secondary">
                        Почему Спейсбу - это лучше, чем сдавать самому или нанимать управляющих?{' '}
                    </h2>
                </div>
                <div className="how-it-works__why-spaceboo__text-container">
                    {/* NOTE: can be improved - with cololrful bulletpoints */}
                    <p className="paragraph how-it-works__why-spaceboo__text">
                        Забудьте о звонках!
                        <br />
                        Теперь вместо того, чтобы звонить Вам напрямую, договариваться о передаче ключей и заселении,
                        арендаторы смогут сделать это через Спейсбу.
                        <br />
                        <br />
                        Больше никаких транспортных и временных затрат!
                        <br />
                        Вам не нужно будет ездить, чтобы встречать и провожать гостей, а это значит, что не нужно будет
                        платить деньги за ваше передвижение, а также терять драгоценное время в городских пробках. Как
                        правило, затраты на передвижение значительно превышают комиссию нашей платформе.
                        <br />
                        <br />
                        Человеческий труд, как правило, стоит дороже автоматизированного. Доверьте управление жильем
                        Спейсбу - это безопасно и выгодно!
                        <br />
                        <br />
                        Оплата = подписание договора об аренде. Спейсбу автоматически заполнит договор на основании
                        верифицированных данных пользователя.
                    </p>
                </div>
            </section>
        </div>
    );
}
