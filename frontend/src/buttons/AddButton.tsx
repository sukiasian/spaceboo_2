import { IButton } from './ButtonTypes';

interface IAddButtonProps extends IButton {}

export default function AddButton(props: IAddButtonProps): JSX.Element {
    const { handleClick } = props;

    return <div className="add-button-icon" onClick={handleClick} />;
}
