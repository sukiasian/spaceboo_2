import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MouseEventHandler } from 'react';

interface INextIconProps {
    handleClick?: MouseEventHandler;
}

export default function NextIcon({ handleClick }: INextIconProps): JSX.Element {
    return (
        <div className="icon-container next-icon-container" onClick={handleClick}>
            <FontAwesomeIcon icon={faArrowCircleRight} style={{ fontSize: '56px' }} />
        </div>
    );
}
