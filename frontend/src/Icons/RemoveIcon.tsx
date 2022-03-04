import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEventHandler } from 'react';

interface IRemoveIconProps {
    handleClick: MouseEventHandler;
}

export default function RemoveIcon(props: IRemoveIconProps): JSX.Element {
    const { handleClick } = props;

    return (
        <FontAwesomeIcon
            icon={faTimes}
            onClick={handleClick}
            style={{ position: 'relative', marginBottom: '40px', marginLeft: '-5px' }}
        />
    );
}
