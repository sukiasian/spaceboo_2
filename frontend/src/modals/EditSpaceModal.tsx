import { RefObject, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseModalButton from '../buttons/CloseModalButton';
import EditSpaceForm from '../forms/EditSpaceForm';
import { toggleEditSpaceModalAction } from '../redux/actions/modalActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { EventKey } from '../types/types';

interface IEditSpaceModalProps {
    editSpaceModalRef: RefObject<HTMLDivElement>;
}

export default function EditSpaceModal(props: IEditSpaceModalProps): JSX.Element | null {
    const { editSpaceModalRef } = props;

    const { editSpaceModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);

    const dispatch = useDispatch();

    const toggleModal = (): void => {
        dispatch(toggleEditSpaceModalAction());
    };
    const closeModalOnCloseButtonClick = (e: MouseEvent): void => {
        e.stopPropagation();

        toggleModal();
    };
    const closeModalOnOutsideClick = (e: Event): void => {
        if (e.target !== editSpaceModalRef.current) {
            toggleModal();
        }
    };
    const closeModalOnEscapeClick = (e: KeyboardEvent): void => {
        if (e.key === EventKey.ESCAPE) {
            toggleModal();
        }
    };
    const applyEventListeners = (): (() => void) => {
        if (editSpaceModalRef.current) {
            document.addEventListener('click', closeModalOnOutsideClick);
            document.addEventListener('keydown', closeModalOnEscapeClick);
        }

        return () => {
            document.removeEventListener('click', closeModalOnOutsideClick);
            document.removeEventListener('keydown', closeModalOnEscapeClick);
        };
    };

    useEffect(applyEventListeners);

    // TODO: нужно переделать инпуты. при создании используются чистые поля,
    // при редактировании нужно учитывать изменилось ли поле и только тогда диспатчить.
    // притом возможно даже не нужна кнопка submit - dispatch будет происходить при завершении ввода

    // плюс нужно переделать SpaceInputFieldsForCreateAndEdit под provideSpace и включить туда те поля которые не были включены из за  того что нужно было применяться еще и в edit space
    return editSpaceModalIsOpen ? (
        <div className="modal edit-space-modal" ref={editSpaceModalRef}>
            <CloseModalButton clickHandler={closeModalOnCloseButtonClick} />
            <EditSpaceForm />
        </div>
    ) : null;
}
