import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CloseModalButton from '../buttons/CloseModalButton';
import Titles from '../components/Titles';
import LockerConnectionAndReturnRequestForm from '../forms/LockerConnectionAndReturnRequestForm';
import DarkScreen from '../hoc/DarkScreen';
import HideComponentOnOutsideClickOrEscapePress from '../hoc/HideComponentOnOutsideClickOrEscapePress';
import { toggleLockerRequestModalAction } from '../redux/actions/modalActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { stopPropagation } from '../utils/utilFunctions';

interface IProps {
    lockerId: string;
    spaceId: string;
}

export default function LockerConnectionAndReturnRequestModal(props: IProps): JSX.Element | null {
    const { lockerId, spaceId } = props;

    const { lockerRequestModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);

    const heading = lockerId ? 'Заявка на возврат локера' : 'Заявка на подключение локера к пространству';

    const componentRef = useRef(null);

    const dispatch = useDispatch();

    const toggleLockerRequestModal = (): void => {
        dispatch(toggleLockerRequestModalAction());
    };

    return lockerRequestModalIsOpen ? (
        <HideComponentOnOutsideClickOrEscapePress
            handleHideComponent={toggleLockerRequestModal}
            innerRef={componentRef}
        >
            <DarkScreen>
                <div className="modal locker-request-modal" ref={componentRef} onClick={stopPropagation}>
                    <Titles heading={heading} />
                    <CloseModalButton clickHandler={toggleLockerRequestModal} />
                    <LockerConnectionAndReturnRequestForm spaceId={spaceId} lockerId={lockerId} />
                </div>
            </DarkScreen>
        </HideComponentOnOutsideClickOrEscapePress>
    ) : null;
}
