import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Alert from '../components/Alert';
import PairLockerForm from '../forms/PairLockerForm';
import DarkScreen from '../hoc/DarkScreen';
import HideComponentOnOutsideClickOrEscapePress from '../hoc/HideComponentOnOutsideClickOrEscapePress';
import { togglePairLockerModal } from '../redux/actions/modalActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { stopPropagation } from '../utils/utilFunctions';

interface IProps {
    spaceId: string;
}

export default function PairLockerModal(props: IProps): JSX.Element | null {
    const { spaceId } = props;

    const { pairLockerModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);
    const { postPairLockerSuccessResponse, postPairLockerFailureResponse } = useSelector(
        (state: IReduxState) => state.adminStorage
    );

    const modalRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const toggleModal = (): void => {
        dispatch(togglePairLockerModal());
    };

    const toggleModalAfterSuccessfulFormSubmit = () => {
        if (postPairLockerSuccessResponse) {
            toggleModal();
        }
    };

    useEffect(toggleModalAfterSuccessfulFormSubmit, [postPairLockerSuccessResponse]);

    return pairLockerModalIsOpen ? (
        <HideComponentOnOutsideClickOrEscapePress handleHideComponent={toggleModal} innerRef={modalRef}>
            <DarkScreen>
                <div className="modal pair-locker-modal" onClick={stopPropagation}>
                    <PairLockerForm spaceId={spaceId} />
                    <Alert failureResponse={postPairLockerFailureResponse} />
                </div>
            </DarkScreen>
        </HideComponentOnOutsideClickOrEscapePress>
    ) : null;
}
