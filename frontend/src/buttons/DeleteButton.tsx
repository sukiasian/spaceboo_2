import AltButton from '../components/AltButton';
import RemoveIcon from '../icons/RemoveIcon';

interface IDeleteButtonProps {
    handleClick: (...props: any) => any;
}

export default function DeleteButton(props: IDeleteButtonProps): JSX.Element {
    const { handleClick } = props;

    return (
        <AltButton
            mainDivClassName="button button-with-icon delete-button"
            buttonText="Удалить"
            handleClick={handleClick}
        >
            <RemoveIcon handleClick={handleClick} />
        </AltButton>
    );
}
