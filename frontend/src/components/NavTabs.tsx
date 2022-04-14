import { NavLink } from 'react-router-dom';

export interface INavTab {
    name: string;
    linkTo: string;
}

interface INavTabsProps {
    tabs: INavTab[];
}

export default function NavTabs(props: INavTabsProps): JSX.Element {
    const { tabs } = props;
    const renderTabs = (): JSX.Element[] => {
        return tabs.map((tab: INavTab, i: number) => {
            return (
                <NavLink to={tab.linkTo} key={i}>
                    <p className={`navtab navtab--${i}`}>{tab.name}</p>
                </NavLink>
            );
        });
    };
    return <div className="navtabs">{renderTabs()}</div>;
}
