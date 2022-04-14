import { NavLink } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-sections">
                    <div className="footer__main">
                        <div className="footer__main__description-container">
                            <h2 className="heading heading--secondary footer-section-name  footer__main__description">
                                SPACEBOO
                            </h2>
                        </div>
                        <div className="footer-links footer__main__links">
                            <div className="footer__main__about-container">
                                <NavLink to="/about/general">
                                    <h3 className="heading heading--tertiary footer-link footer__main__about">О нас</h3>
                                </NavLink>
                            </div>
                            <div className="footer__main__contact-container">
                                <NavLink to="/contact">
                                    <h3 className="heading heading--tertiary footer-link footer__main__contact">
                                        Связаться
                                    </h3>
                                </NavLink>
                            </div>
                            <div className="footer__main__for-investors-container">
                                <NavLink to="/for-investors">
                                    <h3 className="heading heading--tertiary footer-link footer__main__for-investors">
                                        Инвесторам
                                    </h3>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="footer__spaces">
                        <div className="footer__spaces__description-container">
                            <h2 className="heading heading--secondary footer-section-name footer__spaces__description">
                                ПРОСТРАНСТВА
                            </h2>
                        </div>
                        <div className="footer-links footer__spaces__links">
                            <div className="footer__spaces__how-it-works-container">
                                <NavLink to="/how-it-works">
                                    <h3 className="heading heading--tertiary footer-link footer__spaces__how-it-works">
                                        Как это работает?
                                    </h3>
                                </NavLink>
                            </div>
                            <div className="footer__spaces__provide-space-container">
                                <NavLink to="/provide-space">
                                    <h3 className="heading heading--tertiary footer-link footer__spaces__provide-space">
                                        Предоставить пространство
                                    </h3>
                                </NavLink>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer__social-media"></div>
            </div>
            <div className="footer__corporate">
                <p className="paragraph"> Spaceboo © 2022 </p>
            </div>
        </footer>
    );
}
