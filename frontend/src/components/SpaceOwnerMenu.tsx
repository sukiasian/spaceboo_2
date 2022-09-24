import { EventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import EditSpaceModal from '../modals/EditSpaceModal';
import { toggleEditSpaceModalAction } from '../redux/actions/modalActions';
import { deleteSpaceAction } from '../redux/actions/spaceActions';
import { stopPropagation } from '../utils/utilFunctions';
import ConfirmDialog from './ConfirmDialog';

interface ISpaceOwnerMenuProps {
    spaceId: string;
    handleOnDemounting?: (...props: any) => any;
}

export default function SpaceOwnerMenu(props: ISpaceOwnerMenuProps): JSX.Element | null {
    const { spaceId } = props;

    const [componentIsRendered, setComponentIsRendered] = useState(true);
    const [deleteConfirmDialogIsOpen, setDeleteConfirmDialogIsOpen] = useState(false);

    const componentRef = useRef(null);
    const editSpaceModalRef = useRef(null);

    const dispatch = useDispatch();

    const confirmDialogQuestion = 'Вы действительно хотите удалить пространство?';

    const closeComponentOnOutsideClick: EventHandler<any> = (e) => {
        if (e.target !== componentRef.current) {
            setComponentIsRendered(false);

            if (props.handleOnDemounting) {
                props.handleOnDemounting();
            }
        }
    };
    const applyEventListeners = (): (() => void) => {
        document.addEventListener('click', closeComponentOnOutsideClick);

        return () => {
            document.removeEventListener('click', closeComponentOnOutsideClick);
        };
    };

    const toggleEditSpaceModal = (): void => {
        dispatch(toggleEditSpaceModalAction());
    };

    const toggleConfirmDialog = (): void => {
        setDeleteConfirmDialogIsOpen(!deleteConfirmDialogIsOpen);
    };
    const deleteSpace = (): void => {
        dispatch(deleteSpaceAction({ spaceId }));
    };

    useEffect(applyEventListeners);

    return componentIsRendered ? (
        <div className="drop-down space-owner-menu-drop-down" ref={componentRef} onClick={stopPropagation}>
            {/* нам нужны кнопки для редактирования и удаления, где редактирование открывает модальное окно, а удаление диалоговый бокс */}
            <div className="space-owner-menu-drop-down__buttons">
                <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={toggleEditSpaceModal}>
                    Редактировать
                </button>
                <button onClick={toggleConfirmDialog}>Удалить</button>
            </div>
            {deleteConfirmDialogIsOpen ? (
                <ConfirmDialog
                    question={confirmDialogQuestion}
                    positive="Нет"
                    negative="Да"
                    handleCloseButtonClick={toggleConfirmDialog}
                    handlePositiveClick={toggleConfirmDialog}
                    handleNegativeClick={deleteSpace}
                />
            ) : null}
            <EditSpaceModal editSpaceModalRef={editSpaceModalRef} />
        </div>
    ) : null;
}
