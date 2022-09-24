import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { postUnpairLockerAction } from '../redux/actions/adminActions';
import { IDeleteLockerPayload } from '../redux/reducers/adminReducer';
import AltButton from './AltButton';
import ConfirmDialog from './ConfirmDialog';

interface ILockerProps {
    locker: Record<any, any>;
}

export default function Locker(props: ILockerProps): JSX.Element {
    const { locker } = props;

    const [confirmDialogIsOpen, setConfirmDialogIsOpen] = useState(false);

    const dispatch = useDispatch();

    const unpairLocker = (): void => {
        const payload: IDeleteLockerPayload = {
            spaceId: locker.spaceId,
        };

        dispatch(postUnpairLockerAction(payload));
    };

    const toggleUnpairConfirmDialog = (): void => {
        setConfirmDialogIsOpen(!confirmDialogIsOpen);
    };

    return (
        <>
            <div className="locker">
                <div>
                    <h3>id: </h3>
                    <p> {locker.id} </p>
                </div>
                <div>
                    <h3>Адрес: </h3>
                    <p> {locker.space.address}</p>
                </div>
                <div>
                    <h3>Телефон: </h3>
                    <p> {locker.phoneNumber}</p>
                </div>
                <div>
                    <h3>Эл.почта: </h3>
                    <p> {locker.email}</p>
                </div>
                <div>
                    <AltButton buttonText="Отвязать локер" handleClick={toggleUnpairConfirmDialog} />
                </div>
            </div>
            {confirmDialogIsOpen ? (
                <ConfirmDialog
                    question="Отвязать локер от пространства?"
                    positive="Нет"
                    negative="Да"
                    handlePositiveClick={unpairLocker}
                    handleNegativeClick={toggleUnpairConfirmDialog}
                    handleCloseButtonClick={toggleUnpairConfirmDialog}
                />
            ) : null}
        </>
    );
}
