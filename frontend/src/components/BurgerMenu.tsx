import { useEffect, useState } from 'react';
import SideMenuMobile from './SideMenuMobile';

export default function BurgerMenu(): JSX.Element {
    const [sideMenuIsOpen, setSideMenuIsOpen] = useState(false);

    const activeClassName = sideMenuIsOpen ? 'burger-menu--active' : '';

    const toggleSideMenu = (): void => {
        setSideMenuIsOpen((prev) => !prev);
    };

    const renderBurgerMenuStripes = new Array(3).fill(null).map((el, i) => {
        return <div className="burger-menu__stripe" key={i} />;
    });
    const renderSideMenu = (): JSX.Element | void => {
        if (sideMenuIsOpen) {
            return <SideMenuMobile handleCloseButtonClick={toggleSideMenu} />;
        }
    };

    return (
        <>
            <div className={`burger-menu ${activeClassName}`} onClick={toggleSideMenu}>
                {renderBurgerMenuStripes}
            </div>
            {renderSideMenu()}
        </>
    );
}
