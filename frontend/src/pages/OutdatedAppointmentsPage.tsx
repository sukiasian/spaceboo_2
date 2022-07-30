import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RefreshButton from '../buttons/RefreshButton';
import Space from '../components/Space';
import { toggleMyAppointmentsFinalLocationIsDefined } from '../redux/actions/commonActions';
import {
    annualizeFetchSpacesForUserOutdatedAppointmentsResponsesAction,
    fetchSpacesByUserUpcomingAppointmentsAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';

export default function OutdatedAppointmentsPage(): JSX.Element {
    const {
        fetchSpacesByUserOutdatedAppointmentsSuccessResponse,
        fetchSpacesByUserOutdatedAppointmentsFailureResponse,
    } = useSelector((state: IReduxState) => state.spaceStorage);
    const { myAppointmentsFinalLocationIsDefined } = useSelector((state: IReduxState) => state.commonStorage);
    const spaces = fetchSpacesByUserOutdatedAppointmentsFailureResponse?.data || [];
    const dispatch = useDispatch();
    const fetchSpacesForUserUpcomingAppointments = (): void => {
        dispatch(fetchSpacesByUserUpcomingAppointmentsAction());
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
    const handleRefreshButton = (): void => {
        dispatch(annualizeFetchSpacesForUserOutdatedAppointmentsResponsesAction());
        fetchSpacesForUserUpcomingAppointments();
    };
    const renderNoSpacesAppointedMessage = (): JSX.Element | void => {
        if (spaces?.length === 0) {
            return <p>Нет бронирований.</p>;
        }
    };
    const renderSpaces = (): JSX.Element[] => {
        return spaces?.map((space: any, i: number) => {
            return <Space space={space} index={i} key={i} />;
        });
    };
    const renderReloadOnError = (): JSX.Element | void => {
        if (fetchSpacesByUserOutdatedAppointmentsFailureResponse) {
            return (
                <div className="upcoming-appointments__reload">
                    <RefreshButton handleClick={handleRefreshButton} />
                </div>
            );
        }
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div className="upcoming-appointments">
            <div className="spaces-by-appointments">
                <div className="spaces-with-outdated-appointments">
                    {renderNoSpacesAppointedMessage()}
                    {renderSpaces()}
                </div>
            </div>
            {renderReloadOnError()}
        </div>
    );
}
