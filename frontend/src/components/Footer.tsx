import { NavLink } from 'react-router-dom';

export default function Footer() {
    return (
        <div className="footer">
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
            <div className="footer__spaces"></div>
            <div className="footer__social-media"> </div>
        </div>
    );
}
