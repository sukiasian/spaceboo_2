import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import DarkScreen from '../hoc/DarkScreen';
import ContactLink from '../links/ContactLink';
import HowItWorksLink from '../links/HowItWorksLink';
import { IReduxState } from '../redux/reducers/rootReducer';
import { turnOffScrollingOnInit } from '../utils/utilFunctions';
import CityPicker from './CityPicker';
import LogoutButton from '../buttons/LogoutButton';

interface ISideMenuMobileProps {
    handleCloseButtonClick: (...props: any) => any;
}

export default function SideMenuMobile({ handleCloseButtonClick }: ISideMenuMobileProps): JSX.Element {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);

    const userLoginState = fetchUserLoginStateSuccessResponse?.data;

    const authorizationStatusClassName = userLoginState?.loggedIn ? 'side-menu--to-user-bar' : 'side-menu--to-bottom';

    const renderMenuComponentsForAuthorized = (): JSX.Element | null => {
        return userLoginState?.loggedIn ? (
            <>
                <div className="side-menu__elem city-picker-container">
                    <CityPicker />
                </div>
                <div className="side-menu__elem how-it-works-container">
                    <HowItWorksLink />
                </div>
                <div className="side-menu__elem contact-container">
                    <ContactLink />
                </div>
                <LogoutButton mainDivClassName="side-menu__elem logout-container" />
            </>
        ) : null;
    };

    useEffect(turnOffScrollingOnInit, []);

    return (
        <DarkScreen>
            <aside className="side-menu-container" onClick={(e) => e.stopPropagation()}>
                <div className={`side-menu ${authorizationStatusClassName}`}>{renderMenuComponentsForAuthorized()}</div>
            </aside>
        </DarkScreen>
    );
}
