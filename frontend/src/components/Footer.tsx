import AboutUsLink from '../links/AboutUsLink';
import ContactLink from '../links/ContactLink';
import ForInvestorsLink from '../links/ForInvestorsLink';
import HowItWorksLink from '../links/HowItWorksLink';
import ProvideSpaceLink from '../links/ProvideSpaceLink';

export default function Footer() {
    return (
        <section className="footer-section">
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-sections">
                        <div className="footer-part footer__main">
                            <div className="description-container">
                                <h2 className="heading heading--secondary footer-section-name  footer__main__description">
                                    SPACEBOO
                                </h2>
                            </div>
                            <div className="footer-links">
                                <div className="about-us-container">
                                    <AboutUsLink />
                                </div>
                                <div className="footer__main__contact-container">
                                    <ContactLink />
                                </div>
                                <div className="footer__main__for-investors-container">
                                    <ForInvestorsLink />
                                </div>
                            </div>
                        </div>
                        <div className="footer-part footer__spaces">
                            <div className="footer__spaces__description-container">
                                <h2 className="heading heading--secondary footer-section-name footer__spaces__description">
                                    ПРОСТРАНСТВА
                                </h2>
                            </div>
                            <div className="footer-links footer__spaces__links">
                                <div className="how-it-works-link-container">
                                    <HowItWorksLink />
                                </div>
                                <div className="provide-space-link-container">
                                    <ProvideSpaceLink />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer__corporate">
                    <p className="paragraph"> Spaceboo © 2022 </p>
                </div>
            </footer>
        </section>
    );
}
