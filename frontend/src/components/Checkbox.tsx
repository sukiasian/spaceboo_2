interface ICheckboxProps {
    isChecked: boolean;
}

export default function Checkbox(props: ICheckboxProps): JSX.Element {
    const defineIfCheckedClassName = (): string => {
        return props.isChecked ? 'checkbox--checked' : '';
    };

    return <div className={`checkbox ${defineIfCheckedClassName()}`}></div>;
}
