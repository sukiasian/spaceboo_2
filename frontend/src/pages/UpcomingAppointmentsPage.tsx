import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RefreshButton from '../buttons/RefreshButton';
import { toggleMyAppointmentsFinalLocationIsDefined } from '../redux/actions/commonActions';
import { fetchSpacesByUserUpcomingAppointments } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';

export default function UpcomingAppointmentsPage(): JSX.Element {
    const {
        fetchSpacesByUserUpcomingAppointmentsSuccessResponse,
        fetchSpacesByUserUpcomingAppointmentsFailureResponse,
    } = useSelector((state: IReduxState) => state.spaceStorage);
    const { myAppointmentsFinalLocationIsDefined } = useSelector((state: IReduxState) => state.commonStorage);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fetchSpacesForUserUpcomingAppointments = (): void => {
        dispatch(fetchSpacesByUserUpcomingAppointments());
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
    const navigateToOutdatedAppointmentsOrStay = (): void => {
        if (checkIfResponseIsReceivedAndFinalLocationIsDefined()) {
            if (fetchSpacesByUserUpcomingAppointmentsSuccessResponse?.data.length === 0) {
                navigate('/my-appointments/outdated');
            } else {
                dispatch(toggleMyAppointmentsFinalLocationIsDefined());
            }
        }
    };
    const renderReloadOnError = (): JSX.Element | void => {
        if (fetchSpacesByUserUpcomingAppointmentsFailureResponse) {
            return <RefreshButton />;
        }
    };
    const renderSpacesForUpcomingAppointments = (): JSX.Element => {
        return <></>;
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
            <div className="upcoming-appointments__reload"> {renderReloadOnError()}</div>
        </div>
    );
}
