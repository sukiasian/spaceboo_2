import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import RefreshButton from '../buttons/RefreshButton';
import AppointedSpaces from '../components/AppointedSpaces';
import UpcomingAppointmentControlDropdown from '../components/UpcomingAppointmentsControlDropdown';
import ConfirmDialog from '../components/ConfirmDialog';
import { deleteCancelAppointmentAction } from '../redux/actions/appointmentActions';
import { toggleMyAppointmentsFinalLocationIsDefined } from '../redux/actions/commonActions';
import {
    annualizeFetchSpacesForUserUpcomingAppointmentsResponsesAction,
    fetchSpacesByUserUpcomingAppointmentsAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';

// NOTE: control panel is about cancelling appointment
export default function UpcomingAppointmentsPage(): JSX.Element {
    const [cancelAppointmentConfirmDialogIsOpen, setCancelAppointmentConfirmDialogIsOpen] = useState(false);

    const {
        fetchSpacesByUserUpcomingAppointmentsSuccessResponse,
        fetchSpacesByUserUpcomingAppointmentsFailureResponse,
    } = useSelector((state: IReduxState) => state.spaceStorage);
    const { myAppointmentsFinalLocationIsDefined } = useSelector((state: IReduxState) => state.commonStorage);

    const spaces = fetchSpacesByUserUpcomingAppointmentsSuccessResponse?.data;

    const dispatch = useDispatch();
    const { spaceId } = useParams();
    const navigate = useNavigate();

    const fetchSpacesForUserUpcomingAppointments = (): void => {
        dispatch(fetchSpacesByUserUpcomingAppointmentsAction());
    };

    const applyEffectsOnInit = (): void => {
        fetchSpacesForUserUpcomingAppointments();
    };

    const checkIfResponseIsReceivedAndFinalLocationIsDefined = (): boolean => {
        return (fetchSpacesByUserUpcomingAppointmentsSuccessResponse ||
            fetchSpacesByUserUpcomingAppointmentsFailureResponse) &&
            !myAppointmentsFinalLocationIsDefined
            ? true
            : false;
    };
    const cancelAppointment = (): void => {
        dispatch(deleteCancelAppointmentAction({ spaceId: spaceId! }));
    };
    const navigateToOutdatedAppointmentsOrStay = (): void => {
        if (checkIfResponseIsReceivedAndFinalLocationIsDefined()) {
            if (fetchSpacesByUserUpcomingAppointmentsSuccessResponse?.data.length === 0) {
                navigate('/my-appointments/outdated');
            } else {
                dispatch(toggleMyAppointmentsFinalLocationIsDefined());
            }
        }
    };
    const toggleAppointmentConfirmDialog = (): void => {
        setCancelAppointmentConfirmDialogIsOpen((prev) => !prev);
    };
    const handleRefreshButton = (): void => {
        dispatch(annualizeFetchSpacesForUserUpcomingAppointmentsResponsesAction());
    };
    const renderNoSpacesAppointedMessage = (): JSX.Element | void => {
        if (spaces?.length === 0) {
            return <p>Нет бронирований.</p>;
        }
    };
    const renderReloadOnError = (): JSX.Element | void => {
        if (fetchSpacesByUserUpcomingAppointmentsFailureResponse) {
            return (
                <div className="upcoming-appointments__reload">
                    <RefreshButton handleClick={handleRefreshButton} />
                </div>
            );
        }
    };
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

    useEffect(applyEffectsOnInit, []);
    useEffect(navigateToOutdatedAppointmentsOrStay, [
        fetchSpacesByUserUpcomingAppointmentsSuccessResponse,
        fetchSpacesByUserUpcomingAppointmentsFailureResponse,
        navigate,
        dispatch,
    ]);

    return (
        <div className="upcoming-appointments">
            <div className="spaces-by-appointments">
                <div className="spaces-with-appointments spaces-with-active-appointments">
                    {renderNoSpacesAppointedMessage()}
                    <AppointedSpaces
                        spaces={spaces || []}
                        appointmentControlDropdown={
                            <UpcomingAppointmentControlDropdown
                                cancelAppointmentClassNames={'cancel-appointment-button'}
                                cancelAppointment={toggleAppointmentConfirmDialog}
                            />
                        }
                    />
                </div>
                {renderCancelAppointmentDialog()}
            </div>
            <div className="upcoming-appointments__reload"> {renderReloadOnError()}</div>
        </div>
    );
}
