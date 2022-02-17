import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RefreshButton from '../buttons/RefreshButton';
import { toggleMyAppointmentsFinalLocationIsDefined } from '../redux/actions/commonActions';
import { fetchSpacesByUserUpcomingAppointments } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';

export default function OutdatedAppointmentsPage(): JSX.Element {
    const { fetchSpacesByUserOutdatedAppointmentsFailureResponse } = useSelector(
        (state: IReduxState) => state.spaceStorage
    );
    const { myAppointmentsFinalLocationIsDefined } = useSelector((state: IReduxState) => state.commonStorage);
    const dispatch = useDispatch();
    const fetchSpacesForUserUpcomingAppointments = (): void => {
        dispatch(fetchSpacesByUserUpcomingAppointments());
    };
    const setMyAppointmentsFinalLocationAsDefined = (): void => {
        if (!myAppointmentsFinalLocationIsDefined) {
            dispatch(toggleMyAppointmentsFinalLocationIsDefined());
        }
    };
    const applyEffectsOnInit = (): void => {
        fetchSpacesForUserUpcomingAppointments();
        setMyAppointmentsFinalLocationAsDefined();
    };
    const renderReloadOnError = (): JSX.Element | void => {
        if (fetchSpacesByUserOutdatedAppointmentsFailureResponse) {
            return <RefreshButton handleClick={fetchSpacesForUserUpcomingAppointments} />;
        }
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div className="upcoming-appointments">
            <div className="upcoming-appointments__reload"> {renderReloadOnError()}</div>
        </div>
    );
}
