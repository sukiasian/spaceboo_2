import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEventHandler } from 'react';

interface IRemoveIconProps {
    handleClick?: MouseEventHandler;
}

export default function RemoveIcon(props: IRemoveIconProps): JSX.Element {
    const { handleClick } = props;

    return <FontAwesomeIcon className="icon icon--remove" icon={faTimes} onClick={handleClick ?? undefined} />;
}
