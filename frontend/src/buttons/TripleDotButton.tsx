interface ITripleDotButtonProps {
    componentClassNames?: string;
    vertical?: boolean;
    active?: boolean;
    handleClick: (...props: any) => void;
}

export default function TripleDotButton({
    componentClassNames,
    vertical,
    active,
    handleClick,
}: ITripleDotButtonProps): JSX.Element {
    const isVertical = vertical ?? false;

    return (
        <div
            className={`triple-dot-button ${
                isVertical ? 'triple-dot-button--vertical' : 'triple-dot-button--horizontal'
            } ${componentClassNames} ${active ? 'triple-dot-button--active' : ''}`}
            onClick={(e) => {
                e.preventDefault();

                handleClick();
            }}
        />
    );
}
