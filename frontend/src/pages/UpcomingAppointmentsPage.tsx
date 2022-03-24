import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RefreshButton from '../buttons/RefreshButton';
import Space from '../components/Space';
import UpcomingAppointmentsControlPanel from '../components/UpcomingAppointmentsControlPanel';
import { toggleMyAppointmentsFinalLocationIsDefined } from '../redux/actions/commonActions';
import {
    annualizeFetchSpacesForUserUpcomingAppointmentsResponsesAction,
    fetchSpacesByUserUpcomingAppointmentsAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';

// NOTE: control panel is about cancelling appointment
export default function UpcomingAppointmentsPage(): JSX.Element {
    const {
        fetchSpacesByUserUpcomingAppointmentsSuccessResponse,
        fetchSpacesByUserUpcomingAppointmentsFailureResponse,
    } = useSelector((state: IReduxState) => state.spaceStorage);
    const spaces = fetchSpacesByUserUpcomingAppointmentsSuccessResponse?.data;
    const { myAppointmentsFinalLocationIsDefined } = useSelector((state: IReduxState) => state.commonStorage);
    const navigate = useNavigate();
    const dispatch = useDispatch();
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
    const navigateToOutdatedAppointmentsOrStay = (): void => {
        if (checkIfResponseIsReceivedAndFinalLocationIsDefined()) {
            if (fetchSpacesByUserUpcomingAppointmentsSuccessResponse?.data.length === 0) {
                navigate('/my-appointments/outdated');
            } else {
                dispatch(toggleMyAppointmentsFinalLocationIsDefined());
            }
        }
    };
    const handleRefreshButton = (): void => {
        dispatch(annualizeFetchSpacesForUserUpcomingAppointmentsResponsesAction());
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
    const renderSpaces = (): JSX.Element => {
        return spaces?.map((space: any, i: number) => {
            return <Space space={space} index={i} children={<UpcomingAppointmentsControlPanel />} key={i} />;
        });
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
                <div className="spaces-with-upcoming-appointments">{renderSpaces()}</div>
            </div>
            {renderReloadOnError()}
        </div>
    );
}
