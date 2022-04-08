import { NavLink } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div>
                <div className="footer__main">
                    <div className="footer__main__description">
                        <h2> SPACEBOO </h2>
                    </div>
                    <div className="footer__main__about">
                        <NavLink to="">
                            <h3> О нас </h3>
                        </NavLink>
                    </div>
                    <div className="footer__main__about">
                        <NavLink to="">
                            <h3> Связаться </h3>
                        </NavLink>
                    </div>
                    <div className="footer__main__about">
                        <NavLink to="">
                            <h3> Инвесторам </h3>
                        </NavLink>
                    </div>
                </div>
                <div className="footer__spaces">
                    <div className="footer__spaces__how-it-works">
                        <NavLink className="" to="/how-it-works">
                            Как это работает?
                        </NavLink>
                    </div>
                    <div className="footer__spaces__provide-space">
                        <NavLink className="" to="/provide-space">
                            Предоставить пространство
                        </NavLink>
                    </div>
                </div>
                <div className="footer__social-media"> </div>
            </div>
            <div className="footer__corporate">
                <p className="paragraph"> Spaceboo © 2022 </p>
            </div>
        </footer>
    );
}
