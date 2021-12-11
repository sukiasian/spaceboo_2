import { NavLink } from 'react-router-dom';

type NavbarFactoryProps = {
    tabs: string[];
    entity: string;
};

export const NavbarFactory = (props: NavbarFactoryProps) => {
    const { tabs, entity } = props;

    const renderTabs = tabs.map((tab: string, i: number) => {
        const tabLowerCased = tab.toLowerCase();

        return (
            <NavLink to={`${tabLowerCased}`} key={i}>
                <li className={`tab tab--${tabLowerCased}`}> {tab} </li>
            </NavLink>
        );
    });

    return <div className={`navbar ${entity}__navbar`}>{renderTabs}</div>;
};
