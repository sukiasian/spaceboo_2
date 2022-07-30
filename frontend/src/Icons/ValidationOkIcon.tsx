import { faChevronCircleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ValidationOkIconProps {
    identifier: string;
}

export default function ValidationOkIcon(props: ValidationOkIconProps): JSX.Element {
    const { identifier } = props;

    return <FontAwesomeIcon icon={faChevronCircleDown} id={`validation-ok-${identifier}`} className="validation-ok" />;
}
