import { MouseEventHandler, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DeleteButton from '../buttons/DeleteButton';
import EditButton from '../buttons/EditButton';
import EditSpaceModal from '../modals/EditSpaceModal';
import { toggleConfirmDialogAction, toggleEditSpaceModalAction } from '../redux/actions/modalActions';
import { deleteSpaceAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IDeleteSpacePayload } from '../redux/reducers/spaceReducer';
import ConfirmDialog from './ConfirmDialog';

export default function SpaceActionButtonsForOwner(): JSX.Element | null {
    const { fetchSpaceByIdSuccessResponse } = useSelector((state: IReduxState) => state.spaceStorage);
    const { fetchCurrentUserSuccessResponse } = useSelector((state: IReduxState) => state.userStorage);

    const editSpaceModalRef = useRef<HTMLDivElement>(null);

    const params = useParams();

    const dispatch = useDispatch();

    const { spaceId } = params;

    const currentUserData = fetchCurrentUserSuccessResponse?.data;
    const spaceData = fetchSpaceByIdSuccessResponse?.data;

    const deleteQuestion = 'Вы действительно хотите удалить пространство?';

    const spaceBelongsToUser = spaceData && spaceData?.userId === currentUserData?.id ? true : false;

    const toggleDeleteSpaceConfirm = (): void => {
        dispatch(toggleConfirmDialogAction());
    };

    const deleteSpace: MouseEventHandler = (): void => {
        const deleteSpacePayload: IDeleteSpacePayload = {
            spaceId: spaceId!,
        };

        dispatch(deleteSpaceAction(deleteSpacePayload));
    };

    const toggleEditSpaceModal = (): void => {
        dispatch(toggleEditSpaceModalAction());
    };

    return spaceBelongsToUser ? (
        <>
            <div className="space-owner-menu">
                <EditButton handleClick={toggleEditSpaceModal} />
                <DeleteButton handleClick={toggleDeleteSpaceConfirm} />
            </div>
            <EditSpaceModal editSpaceModalRef={editSpaceModalRef} />
            <ConfirmDialog
                question={deleteQuestion}
                positive="Нет"
                negative="Да"
                handleCloseButtonClick={toggleDeleteSpaceConfirm}
                handlePositiveClick={toggleDeleteSpaceConfirm}
                handleNegativeClick={deleteSpace}
            />
        </>
    ) : null;
}
