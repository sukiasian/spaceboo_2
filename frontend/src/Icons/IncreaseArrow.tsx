import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IArrowIconProps } from '../types/types';

interface IIncreaseArrowProps extends IArrowIconProps {}

export default function IncreaseArrow(props: IIncreaseArrowProps): JSX.Element {
    const { combinedClassNames, handleClick } = props;

    return (
        <div className={`icon icon-container arrow-icon-container arrow arrow--increase ${combinedClassNames ?? ''}`}>
            <FontAwesomeIcon icon={faAngleRight} onClick={handleClick} />
        </div>
    );
}
