import { EventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
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

    const dispatch = useDispatch();

    const confirmDialogQuestion = 'Вы действительно хотите удалить пространство?';

    const toggleConfirmDialog = (): void => {
        setDeleteConfirmDialogIsOpen(!deleteConfirmDialogIsOpen);
    };
    const deleteSpace = (): void => {
        dispatch(deleteSpaceAction({ spaceId }));
    };

    const closeComponentOnOutsideClick: EventHandler<any> = (e) => {
        if (e.target !== componentRef.current) {
            setComponentIsRendered(false);
        }
    };
    const applyEventListeners = (): (() => void) => {
        document.addEventListener('click', closeComponentOnOutsideClick);

        return () => {
            document.removeEventListener('click', closeComponentOnOutsideClick);

            if (props.handleOnDemounting) {
                props.handleOnDemounting();
            }
        };
    };

    useEffect(applyEventListeners);

    return componentIsRendered ? (
        <div className="drop-down space-owner-menu-drop-down" ref={componentRef} onClick={stopPropagation}>
            {/* нам нужны кнопки для редактирования и удаления, где редактирование открывает модальное окно, а удаление диалоговый бокс */}
            <div className="space-owner-menu-drop-down__buttons">
                <button style={{ border: 'none', backgroundColor: 'transparent' }}> Редактировать</button>
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
        </div>
    ) : null;
}
