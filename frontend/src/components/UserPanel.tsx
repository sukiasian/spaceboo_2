import { useState } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { IReduxState } from '../redux/reducers/rootReducer';
import { UrlPathname } from '../types/types';
import BurgerMenu from './BurgerMenu';

enum UserPanelButton {
    APPOINTMENTS = 'my-appointments-button',
    SPACES = 'my-spaces-button',
    PROVIDE_SPACE = 'provide-space-button',
    KEYS = 'keys-button',
}

// footer corporate для мобильных устройств нужно будет либо убрать везде либо оставить только в
export default function UserPanel(): JSX.Element {
    const [activeButton, setActiveButton] = useState<string>();

    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);

    const userLoginState = fetchUserLoginStateSuccessResponse?.data;

    const setActiveButtonByButtonName = (userPanelButton: UserPanelButton): (() => void) => {
        return () => {
            switch (userPanelButton) {
                case UserPanelButton.APPOINTMENTS:
                    setActiveButton(UserPanelButton.APPOINTMENTS);

                    break;

                case UserPanelButton.SPACES:
                    setActiveButton(UserPanelButton.SPACES);

                    break;

                case UserPanelButton.PROVIDE_SPACE:
                    setActiveButton(UserPanelButton.PROVIDE_SPACE);

                    break;

                case UserPanelButton.KEYS:
                    setActiveButton(UserPanelButton.KEYS);

                    break;
            }
        };
    };

    const defineActiveButtonClassName = (userPanelButton: UserPanelButton): string => {
        return userPanelButton === activeButton ? userPanelButton + '--active' : '';
    };

    return (
        <>
            {userLoginState?.loggedIn ? (
                <section className="user-panel">
                    <NavLink
                        to={UrlPathname.MY_APPOINTMENTS}
                        onClick={setActiveButtonByButtonName(UserPanelButton.APPOINTMENTS)}
                    >
                        <div
                            className={`user-panel__elem ${UserPanelButton.APPOINTMENTS} ${defineActiveButtonClassName(
                                UserPanelButton.APPOINTMENTS
                            )}`}
                        />
                    </NavLink>
                    <NavLink to={UrlPathname.SPACES} onClick={setActiveButtonByButtonName(UserPanelButton.SPACES)}>
                        <div
                            className={`user-panel__elem ${UserPanelButton.SPACES} ${defineActiveButtonClassName(
                                UserPanelButton.SPACES
                            )}`}
                        />
                    </NavLink>
                    <NavLink
                        to={UrlPathname.PROVIDE_SPACE}
                        onClick={setActiveButtonByButtonName(UserPanelButton.PROVIDE_SPACE)}
                    >
                        <div
                            className={`user-panel__elem ${UserPanelButton.PROVIDE_SPACE} ${defineActiveButtonClassName(
                                UserPanelButton.PROVIDE_SPACE
                            )}`}
                        />
                    </NavLink>
                    <NavLink to={UrlPathname.KEYS} onClick={setActiveButtonByButtonName(UserPanelButton.KEYS)}>
                        <div
                            className={`user-panel__elem ${UserPanelButton.KEYS} ${defineActiveButtonClassName(
                                UserPanelButton.KEYS
                            )}`}
                        />
                    </NavLink>
                    <div className="user-panel__elem burger-menu-container">
                        <BurgerMenu />
                    </div>
                </section>
            ) : null}
        </>
    );
}
