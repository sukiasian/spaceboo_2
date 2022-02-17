import { IButton } from './ButtonTypes';

interface IAddButtonProps extends IButton {}

export default function AddButton(props: IAddButtonProps): JSX.Element {
    const { handleClick } = props;

    return (
        <div
            className="add-button-icon"
            style={{
                display: 'block',
                width: '45px',
                height: '45px',
                background: 'url(/images/icons/icon-add.png)',
                backgroundSize: 'cover',
            }}
            onClick={handleClick}
        />
    );
}
