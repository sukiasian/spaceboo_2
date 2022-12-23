import { EventHandler, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import EditSpaceModal from '../modals/EditSpaceModal';
import LockerConnectionAndReturnRequestModal from '../modals/LockerConnectionAndReturnRequestModal';
import {
    toggleEditSpaceModalAction,
    toggleLockerRequestModalAction,
    toggleLockerReturnRequestModalAction,
} from '../redux/actions/modalActions';
import { deleteSpaceAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { stopPropagation } from '../utils/utilFunctions';
import ConfirmDialog from './ConfirmDialog';
import DisappearingAlert from './DisappearingAlert';

interface ISpaceOwnerMenuProps {
    spaceId: string;
    lockerId: string;
    handleOnDemounting?: (...props: any) => any;
}

export default function SpaceOwnerMenu(props: ISpaceOwnerMenuProps): JSX.Element | null {
    // NOTE: возможно выдаст ошибку
    const { spaceId, lockerId } = props;

    const [componentIsRendered, setComponentIsRendered] = useState(true);
    const [deleteConfirmDialogIsOpen, setDeleteConfirmDialogIsOpen] = useState(false);

    const { lockerRequestModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);
    const {
        postRequestLockerSuccessResponse,
        postRequestLockerFailureResponse,
        postRequestLockerReturnSuccessResponse,
        postRequestLockerReturnFailureResponse,
    } = useSelector((state: IReduxState) => state.lockerRequestsStorage);

    const componentRef = useRef<HTMLDivElement>(null);
    const editSpaceModalRef = useRef(null);

    const dispatch = useDispatch();

    const confirmDialogQuestion = 'Вы действительно хотите удалить пространство?';

    const closeComponentOnOutsideClick: EventHandler<any> = (e) => {
        if (e.target !== componentRef.current && !lockerRequestModalIsOpen) {
            setComponentIsRendered(false);
            props.handleOnDemounting!();
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

    const toggleLockerRequestModal = (): void => {
        dispatch(toggleLockerRequestModalAction());
    };
    const toggleLockerReturnRequestModal = (): void => {
        dispatch(toggleLockerReturnRequestModalAction());
    };
    const renderLockerReturnOrRequestButton = (): JSX.Element => {
        return lockerId ? (
            <button onClick={toggleLockerReturnRequestModal}>Запросить возврат локера</button>
        ) : (
            <button onClick={toggleLockerRequestModal}>Запросить подключение к локеру</button>
        );
    };

    useEffect(applyEventListeners);

    return componentIsRendered ? (
        <>
            <div className="drop-down space-owner-menu-drop-down" ref={componentRef} onClick={stopPropagation}>
                <div className="space-owner-menu-drop-down__buttons">
                    <button style={{ border: 'none', backgroundColor: 'transparent' }} onClick={toggleEditSpaceModal}>
                        Редактировать
                    </button>
                    <button onClick={toggleConfirmDialog}>Удалить</button>
                    {renderLockerReturnOrRequestButton()}
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
            <EditSpaceModal editSpaceModalRef={editSpaceModalRef} />
            <LockerConnectionAndReturnRequestModal spaceId={spaceId} lockerId={lockerId ?? undefined} />
            <DisappearingAlert
                successResponse={lockerId ? postRequestLockerReturnSuccessResponse : postRequestLockerSuccessResponse}
                failureResponse={lockerId ? postRequestLockerReturnFailureResponse : postRequestLockerFailureResponse}
            />
        </>
    ) : null;
}
