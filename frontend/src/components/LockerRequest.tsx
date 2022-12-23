import { MouseEventHandler, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    annualizeDeleteLockerRequestResponsesAction,
    annualizePostPairLockerResponsesAction,
} from '../redux/actions/adminActions';
import { deleteLockerRequestByIdAction } from '../redux/actions/lockerRequestsActions';
import { togglePairLockerModal } from '../redux/actions/modalActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import AltButton from './AltButton';

interface ILockerRequestProps {
    request: Record<any, any>;
    setSpaceIdOfRequest: (...props: any) => any;
}

export default function LockerRequest(props: ILockerRequestProps): JSX.Element | null {
    const { request, setSpaceIdOfRequest } = props;

    const [isRendered, setIsRendered] = useState(true);

    const { deleteLockerRequestByIdSuccessResponse, postPairLockerSuccessResponse } = useSelector(
        (state: IReduxState) => state.adminStorage
    );

    const dispatch = useDispatch();

    const annualizeResponsesOnDeinit = (): void => {
        // dispatch(deleteLockerRequestByIdAction({ requestId: request.id }));
        dispatch(annualizeDeleteLockerRequestResponsesAction());
        dispatch(annualizePostPairLockerResponsesAction());
    };

    const applyEffectsOnInit = (): (() => void) => {
        return () => {
            annualizeResponsesOnDeinit();
        };
    };

    const togglePairModal: MouseEventHandler = (e) => {
        e.stopPropagation();

        setSpaceIdOfRequest(request.spaceId);
        dispatch(togglePairLockerModal());
    };

    const deleteRequest = (): void => {
        dispatch(deleteLockerRequestByIdAction({ requestId: request.id }));
    };

    const hideComponentWhenDeletedSuccessfully = (): void => {
        if (deleteLockerRequestByIdSuccessResponse || postPairLockerSuccessResponse) {
            setIsRendered(false);
        }
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(hideComponentWhenDeletedSuccessfully, [
        deleteLockerRequestByIdSuccessResponse,
        postPairLockerSuccessResponse,
    ]);

    return isRendered ? (
        <div className="locker-request">
            <div>
                <h3> Тип запроса </h3>
                <p> {request.type} </p>
            </div>
            <div>
                <h3>id пространства</h3>
                <p>{request.spaceId} </p>
            </div>
            <div>
                <h3>Номер телефона</h3>
                <p>{request.phoneNumber} </p>
            </div>
            <div>
                <h3>Эл. почта</h3>
                <p>{request.email} </p>
            </div>
            <div className="buttons action-buttons">
                <AltButton buttonText="Подключить" handleClick={togglePairModal} />
                <AltButton buttonText="Отклонить заявку" handleClick={deleteRequest} />
            </div>
        </div>
    ) : null;
}
