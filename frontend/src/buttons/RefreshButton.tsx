import { IButton } from './ButtonTypes';

interface IRefreshButtonProps extends IButton {}

export default function RefreshButton(props: IRefreshButtonProps): JSX.Element {
    const { handleClick } = props;

    return (
        <div
            className="reload-button-icon"
            // TODO: remove on prod and write in stylesheets
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
