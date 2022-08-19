import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import TripleDotButton from '../buttons/TripleDotButton';
import { deleteCancelAppointmentAction } from '../redux/actions/appointmentActions';
import AppointmentControlDropdown from './AppointmentControlDropdown';
import ConfirmDialog from './ConfirmDialog';
import Space from './Space';

interface IAppointedSpacesProps {
    spaces: any[];
}

export default function AppointedSpaces({ spaces }: IAppointedSpacesProps): JSX.Element {
    const [indexOfSpaceWhereTripleDotsClicked, setIndexOfSpaceWhereTripleDotsClicked] = useState<number>();
    const [appointmentControlDropdownIsOpen, setAppointmentControlDropdownIsOpen] = useState(false);
    const [cancelAppointmentConfirmDialogIsOpen, setCancelAppointmentConfirmDialogIsOpen] = useState(false);

    const dispatch = useDispatch();
    const { spaceId } = useParams();

    const toggleAppointmentMenuDropdown = (): void => {
        setAppointmentControlDropdownIsOpen((prev) => !prev);
    };

    const toggleAppointmentConfirmDialog = (): void => {
        setCancelAppointmentConfirmDialogIsOpen((prev) => !prev);
    };

    const toggleIndexOfSpaceWhereTripleDotsClicked = (i: number): void => {
        indexOfSpaceWhereTripleDotsClicked !== undefined
            ? setIndexOfSpaceWhereTripleDotsClicked(undefined)
            : setIndexOfSpaceWhereTripleDotsClicked(i);
    };

    const cancelAppointment = (): void => {
        dispatch(deleteCancelAppointmentAction({ spaceId: spaceId! }));
    };

    const renderAppointmentControlDropdown = (): JSX.Element | void => {
        if (appointmentControlDropdownIsOpen) {
            return (
                <AppointmentControlDropdown
                    cancelAppointmentClassNames={'cancel-appointment-button'}
                    cancelAppointment={toggleAppointmentConfirmDialog}
                />
            );
        }
    };
    // BUG при нажатии на точки все точки становятся активными. так не должно быть
    const renderSpaces = spaces.map((space: any, i) => {
        return (
            <Space space={space} index={i} key={i}>
                <>
                    <TripleDotButton
                        componentClassNames={`triple-dot-button--${i}`}
                        vertical
                        active={indexOfSpaceWhereTripleDotsClicked === i}
                        handleClick={(e) => {
                            setIndexOfSpaceWhereTripleDotsClicked(i);

                            toggleAppointmentMenuDropdown();
                            toggleIndexOfSpaceWhereTripleDotsClicked(i);
                        }}
                    />
                    {i === indexOfSpaceWhereTripleDotsClicked ? renderAppointmentControlDropdown() : null}
                </>
            </Space>
        );
    });

    const renderCancelAppointmentDialog = (): JSX.Element | void => {
        if (cancelAppointmentConfirmDialogIsOpen) {
            return (
                <ConfirmDialog
                    question="Отменить бронирование?"
                    positive="Да"
                    negative="нет"
                    handlePositiveClick={cancelAppointment}
                    handleNegativeClick={toggleAppointmentConfirmDialog}
                    handleCloseButtonClick={toggleAppointmentConfirmDialog}
                />
            );
        }
    };

    return (
        <div className="spaces">
            {renderSpaces}
            {renderCancelAppointmentDialog()}
        </div>
    );
}
