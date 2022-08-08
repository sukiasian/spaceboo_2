import { faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IArrowIconProps } from '../types/types';

interface IDecreaseArrowProps extends IArrowIconProps {}

export default function DecreaseArrow(props: IDecreaseArrowProps): JSX.Element {
    const { combinedClassNames, handleClick } = props;

    return (
        <div className={`icon icon-container arrow-icon-container arrow arrow--decrease ${combinedClassNames ?? ''}`}>
            <FontAwesomeIcon icon={faAngleLeft} onClick={handleClick ?? undefined} />
        </div>
    );
}
