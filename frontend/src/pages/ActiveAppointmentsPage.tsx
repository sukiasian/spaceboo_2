import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import RefreshButton from '../buttons/RefreshButton';
import AppointedSpaces from '../components/AppointedSpaces';
import AppointmentControlDropdown from '../components/UpcomingAppointmentsControlDropdown';
import ConfirmDialog from '../components/ConfirmDialog';
import { deleteCancelAppointmentAction } from '../redux/actions/appointmentActions';
import { toggleMyAppointmentsFinalLocationIsDefined } from '../redux/actions/commonActions';
import {
    annualizeFetchSpacesForUserActiveAppointmentsResponsesAction,
    fetchSpacesByUserActiveAppointmentsAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';

// NOTE: control panel should be about stopping appointment. That means that the user should leave the house within 1 hour
export default function ActiveAppointmentsPage(): JSX.Element {
    const [cancelAppointmentConfirmDialogIsOpen, setCancelAppointmentConfirmDialogIsOpen] = useState(false);

    const { fetchSpacesByUserActiveAppointmentsSuccessResponse, fetchSpacesByUserActiveAppointmentsFailureResponse } =
        useSelector((state: IReduxState) => state.spaceStorage);
    const { myAppointmentsFinalLocationIsDefined } = useSelector((state: IReduxState) => state.commonStorage);

    const spaces = fetchSpacesByUserActiveAppointmentsSuccessResponse?.data;

    const dispatch = useDispatch();
    const { spaceId } = useParams();
    const navigate = useNavigate();

    const fetchSpacesForUserActiveAppointments = (): void => {
        dispatch(fetchSpacesByUserActiveAppointmentsAction());
    };
    const cancelAppointment = (): void => {
        dispatch(deleteCancelAppointmentAction({ spaceId: spaceId! }));
    };
    const applyEffectsOnInit = (): void => {
        fetchSpacesForUserActiveAppointments();
    };
    const checkIfResponseIsReceivedFinalLocationIsDefinedAndBroughtThroughNavLink = (): boolean => {
        return (fetchSpacesByUserActiveAppointmentsSuccessResponse ||
            fetchSpacesByUserActiveAppointmentsFailureResponse) &&
            !myAppointmentsFinalLocationIsDefined
            ? true
            : false;
    };
    // NOTE: можно оставить только myAppointmentsFinalLocationIsDefined, поставить начальное значение true, а при переходе через navlink сделать его false.
    const navigateToUpcomingAppointmentsOrStay = (): void => {
        if (checkIfResponseIsReceivedFinalLocationIsDefinedAndBroughtThroughNavLink()) {
            if (fetchSpacesByUserActiveAppointmentsSuccessResponse?.data.length === 0) {
                navigate('/my-appointments/upcoming');
            } else {
                dispatch(toggleMyAppointmentsFinalLocationIsDefined());
            }
        }
    };
    const handleRefreshButton = (): void => {
        dispatch(annualizeFetchSpacesForUserActiveAppointmentsResponsesAction());
        fetchSpacesForUserActiveAppointments();
    };

    const toggleAppointmentConfirmDialog = (): void => {
        setCancelAppointmentConfirmDialogIsOpen((prev) => !prev);
    };

    const renderNoSpacesAppointedMessage = (): JSX.Element | void => {
        if (spaces?.length === 0) {
            return <p>Нет бронирований.</p>;
        }
    };
    const renderReloadOnError = (): JSX.Element | void => {
        if (fetchSpacesByUserActiveAppointmentsFailureResponse) {
            return <RefreshButton handleClick={handleRefreshButton} />;
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
    useEffect(navigateToUpcomingAppointmentsOrStay, [
        fetchSpacesByUserActiveAppointmentsSuccessResponse,
        fetchSpacesByUserActiveAppointmentsFailureResponse,
        navigate,
        dispatch,
    ]);

    return (
        <div className="upcoming-appointments">
            <div className="spaces-by-appointments">
                <div className="spaces-with-active-appointments">
                    {renderNoSpacesAppointedMessage()}
                    <AppointedSpaces
                        spaces={spaces || []}
                        appointmentControlDropdown={
                            <AppointmentControlDropdown
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
