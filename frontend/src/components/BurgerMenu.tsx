export default function BurgerMenu(): JSX.Element {
    const renderBurgerMenuStripes = new Array(3).fill(null).map((el) => {
        return <div className="burger-menu__stripe" />;
    });

    return <div className="burger-menu">{renderBurgerMenuStripes}</div>;
}
