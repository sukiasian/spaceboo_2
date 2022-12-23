import { RefObject } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CloseModalButton from '../buttons/CloseModalButton';
import EditSpaceForm from '../forms/EditSpaceForm';
import DarkScreen from '../hoc/DarkScreen';
import HideComponentOnOutsideClickOrEscapePress from '../hoc/HideComponentOnOutsideClickOrEscapePress';
import { toggleEditSpaceModalAction } from '../redux/actions/modalActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { stopPropagation } from '../utils/utilFunctions';

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

    // TODO: нужно переделать инпуты. при создании используются чистые поля,
    // при редактировании нужно учитывать изменилось ли поле и только тогда диспатчить.
    // притом возможно даже не нужна кнопка submit - dispatch будет происходить при завершении ввода

    // плюс нужно переделать SpaceInputFieldsForCreateAndEdit под provideSpace и включить туда те поля которые не были включены из за  того что нужно было применяться еще и в edit space
    return editSpaceModalIsOpen ? (
        <HideComponentOnOutsideClickOrEscapePress innerRef={editSpaceModalRef} handleHideComponent={toggleModal}>
            <DarkScreen>
                <div className="modal edit-space-modal" ref={editSpaceModalRef} onClick={stopPropagation}>
                    <CloseModalButton clickHandler={toggleModal} />
                    <EditSpaceForm />
                </div>
            </DarkScreen>
        </HideComponentOnOutsideClickOrEscapePress>
    ) : null;
}
