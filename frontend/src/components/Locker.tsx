import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { annualizeDeleteUnpairLockerResponsesAction, postUnpairLockerAction } from '../redux/actions/adminActions';
import { toggleConfirmDialogAction } from '../redux/actions/modalActions';
import { IDeleteLockerPayload } from '../redux/reducers/adminReducer';
import { IReduxState } from '../redux/reducers/rootReducer';
import AltButton from './AltButton';
import ConfirmDialog from './ConfirmDialog';

interface ILockerProps {
    locker: Record<any, any>;
}

export default function Locker(props: ILockerProps): JSX.Element {
    const { locker } = props;

    const { deleteUnpairLockerSuccessResponse } = useSelector((state: IReduxState) => state.adminStorage);

    const dispatch = useDispatch();

    const annualizeDeleteUnpairLockerResponses = (): void => {
        dispatch(annualizeDeleteUnpairLockerResponsesAction());
    };
    const applyEffectsOnInit = (): (() => void) => {
        return () => {
            annualizeDeleteUnpairLockerResponses();
        };
    };

    const unpairLocker = (): void => {
        const payload: IDeleteLockerPayload = {
            spaceId: locker.spaceId,
        };

        dispatch(postUnpairLockerAction(payload));
    };

    const toggleUnpairConfirmDialog = (): void => {
        dispatch(toggleConfirmDialogAction());
    };

    const hideComponentWhenDeletedSuccessfully = (): void => {
        if (deleteUnpairLockerSuccessResponse) {
            // setIsRendered(false);
        }
    };
    // реализовать: аннулирование после деинициализации + скрытие при успешном unpairing-e

    useEffect(applyEffectsOnInit, []);
    useEffect(hideComponentWhenDeletedSuccessfully, [deleteUnpairLockerSuccessResponse]);

    return (
        <>
            <div className="locker">
                <div>
                    <h3>id: </h3>
                    <p> {locker?.id} </p>
                </div>
                <div>
                    <h3>Пространство</h3>
                    <NavLink to={`/spaces/${locker?.spaceId}`}>Посмотреть пространство</NavLink>
                </div>
                <div>
                    <h3>Адрес: </h3>
                    <p> {locker?.space.address}</p>
                </div>
                <div>
                    <h3>Телефон: </h3>
                    <p> {locker?.phoneNumber}</p>
                </div>
                <div>
                    <h3>Эл.почта: </h3>
                    <p> {locker?.email}</p>
                </div>
                <div>
                    <AltButton buttonText="Отвязать локер" handleClick={toggleUnpairConfirmDialog} />
                </div>
            </div>
            <ConfirmDialog
                question="Отвязать локер от пространства?"
                positive="Нет"
                negative="Да"
                handlePositiveClick={toggleUnpairConfirmDialog}
                handleNegativeClick={unpairLocker}
                handleCloseButtonClick={toggleUnpairConfirmDialog}
            />
        </>
    );
}
