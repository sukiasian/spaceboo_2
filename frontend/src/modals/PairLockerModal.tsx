import { ETIME } from 'constants';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PairLockerForm from '../forms/PairLockerForm';
import { togglePairLockerModal } from '../redux/actions/modalActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { EventKey } from '../types/types';

export default function PairLockerModal(): JSX.Element | null {
    const { pairLockerModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);

    const modalRef = useRef<HTMLDivElement>(null);

    const dispatch = useDispatch();

    const toggleModal = (): void => {
        dispatch(togglePairLockerModal());
    };

    const closeModalOnOutsideClick = (e: Event) => {
        if (e.target !== modalRef.current) {
            toggleModal();
        }
    };
    const closeModalOnEscapePress = (e: KeyboardEvent) => {
        if (e.key === EventKey.ESCAPE) {
            toggleModal();
        }
    };
    const applyEventListenersForModal = (): (() => void) | void => {
        if (modalRef.current) {
            document.addEventListener('click', closeModalOnOutsideClick);
            document.addEventListener('keypress', closeModalOnEscapePress);

            return () => {
                document.removeEventListener('click', closeModalOnOutsideClick);
                document.removeEventListener('keypress', closeModalOnOutsideClick);
            };
        }
    };

    useEffect(applyEventListenersForModal);

    return (
        <>
            {pairLockerModalIsOpen ? (
                <div className="modal pair-locker-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                    <PairLockerForm />
                </div>
            ) : null}
        </>
    );
}
