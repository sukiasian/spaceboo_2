import { MouseEventHandler } from 'react';
import { useDispatch } from 'react-redux';
import { togglePairLockerModal } from '../redux/actions/modalActions';
import AltButton from './AltButton';

interface ILockerRequestProps {
    request: Record<any, any>;
}

export default function LockerRequest(props: ILockerRequestProps): JSX.Element {
    const { request } = props;

    const dispatch = useDispatch();

    const togglePairModal: MouseEventHandler = (e) => {
        e.stopPropagation();

        dispatch(togglePairLockerModal());
    };

    const deleteRequest = (): void => {
        dispatch('');
    };

    return (
        <div className="locker-request">
            <div>
                <h3> Тип запроса </h3>
                <p> {request.type} </p>
            </div>
            <div>
                <h3>id</h3>
                <p>{request.id} </p>
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
    );
}
