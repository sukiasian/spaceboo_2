import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RefreshButton from '../buttons/RefreshButton';
import Space from '../components/Space';
import { toggleMyAppointmentsFinalLocationIsDefined } from '../redux/actions/commonActions';
import {
    annualizeFetchSpacesForUserActiveAppointmentsResponsesAction,
    fetchSpacesByUserActiveAppointmentsAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';

// NOTE: control panel should be about stopping appointment. That means that the user should leave the house within 1 hour
export default function ActiveAppointmentsPage(): JSX.Element {
    const { fetchSpacesByUserActiveAppointmentsSuccessResponse, fetchSpacesByUserActiveAppointmentsFailureResponse } =
        useSelector((state: IReduxState) => state.spaceStorage);
    const { myAppointmentsFinalLocationIsDefined } = useSelector((state: IReduxState) => state.commonStorage);
    const spaces = fetchSpacesByUserActiveAppointmentsSuccessResponse?.data;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fetchSpacesForUserActiveAppointments = (): void => {
        dispatch(fetchSpacesByUserActiveAppointmentsAction());
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
    const renderReloadOnError = (): JSX.Element | void => {
        if (fetchSpacesByUserActiveAppointmentsFailureResponse) {
            return <RefreshButton handleClick={handleRefreshButton} />;
        }
    };
    const renderSpaces = (): JSX.Element[] => {
        return spaces?.map((space: any, i: number) => {
            return <Space space={space} index={i} key={i} />;
        });
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
                <div className="spaces-with-active-appointments">{renderSpaces()}</div>
            </div>
            <div className="upcoming-appointments__reload"> {renderReloadOnError()}</div>
        </div>
    );
}
