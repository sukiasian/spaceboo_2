import { NavLink } from 'react-router-dom';
import Titles from '../components/Titles';

export default function ForInvestorsPage() {
    return (
        <div className="page for-investors-page">
            <Titles heading="Инвесторам" />
            <div className="paragraph-container">
                <p className="">
                    Спейсбу открыт для инвестиций! Если мы еще не нашли Вас, Вы можете опередить нас и
                    <NavLink to="/contact"> связаться</NavLink> с нами.
                </p>
            </div>
        </div>
    );
}
