import { useDispatch } from 'react-redux';
import AltButton from './AltButton';

export default function LockerRequest(): JSX.Element {
    const dispatch = useDispatch();
    // при нажатии на подключить должно открываться модальное окно. Поэтому добавляем в  modalStorage в redux

    /* 
    
    подтягиваем информацию о реквесте. в нем есть поле спейс и соответственно оттуда получаем адрес. Из поля спейс мы также 
    можем получить информацию об email.

    номер телефона есть в самом locker-request.
    


    */

    const togglePairingLockerModal = (): void => {};
    const deleteRequest = (): void => {
        dispatch('');
    };

    return (
        <div className="locker-request">
            <p> Type of request </p>
            <div className="buttons action-buttons">
                <AltButton buttonText="Подключить" handleClick={togglePairingLockerModal} />
                <AltButton buttonText="Отклонить заявку" />
            </div>
        </div>
    );
}
