import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import AltButton from '../components/AltButton';

interface IEditButtonProps {
    handleClick: (...props: any) => any;
}

export default function EditButton(props: IEditButtonProps): JSX.Element {
    const { handleClick } = props;

    return (
        <AltButton
            mainDivClassName="button button-with-icon button--secondary edit-button"
            buttonText="Редактировать"
            handleClick={handleClick}
        >
            <div className="icon-container">
                <FontAwesomeIcon icon={faEdit} />
            </div>
        </AltButton>
    );
}
