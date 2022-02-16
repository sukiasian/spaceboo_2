import { IButton } from './ButtonTypes';

interface IReloadButtonProps extends IButton {}

export default function ReloadButton(props: IReloadButtonProps): JSX.Element {
    const { handleClick } = props;

    return (
        <div
            className="reload-button-icon"
            style={{
                background: 'url(/images/icons/icon-refresh.png)',
                width: '60px',
                height: '60px',
                backgroundSize: 'cover',
            }}
            onClick={handleClick}
        />
    );
}
