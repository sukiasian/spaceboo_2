import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEventHandler, RefObject } from 'react';

interface IRemoveIconProps<T> {
    handleClick?: MouseEventHandler;
    innerRef?: RefObject<HTMLDivElement>;
}

export default function RemoveIcon<T>(props: IRemoveIconProps<T>): JSX.Element {
    const { handleClick, innerRef } = props;

    return (
        <div className="icon icon-container remove-icon-container" ref={innerRef ?? undefined}>
            <FontAwesomeIcon className="icon icon--remove" icon={faTimes} onClick={handleClick ?? undefined} />
        </div>
    );
}
