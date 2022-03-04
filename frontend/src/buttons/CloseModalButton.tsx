import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface ICloseModalButtonProps {
    clickHandler: (...props: any) => any;
}

export default function CloseModalButton(props: ICloseModalButtonProps): JSX.Element {
    const { clickHandler } = props;

    return (
        <div className="close-modal-button" onClick={clickHandler}>
            <FontAwesomeIcon icon={faTimes} />
        </div>
    );
}
