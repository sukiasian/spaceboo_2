import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchSpacesByUserUpcomingAppointments } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { ReduxCommonActions } from '../types/types';

export default function UpcomingAppointmentsPage(): JSX.Element {
    const {
        fetchSpacesByUserUpcomingAppointmentsSuccessResponse,
        fetchSpacesByUserUpcomingAppointmentsFailureResponse,
    } = useSelector((state: IReduxState) => state.spaceStorage);
    const { myAppointmentsPageIsLoaded } = useSelector((state: IReduxState) => state.commonStorage);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fetchSpacesForUserUpcomingAppointments = (): void => {
        dispatch(fetchSpacesByUserUpcomingAppointments());
    };
    const applyEffectsOnInit = (): void => {
        fetchSpacesForUserUpcomingAppointments();
    };
    const checkIfResponseIsReceived = (): boolean => {
        return fetchSpacesByUserUpcomingAppointmentsSuccessResponse ||
            fetchSpacesByUserUpcomingAppointmentsFailureResponse
            ? true
            : false;
    };
    const navigateToOutdatedAppointmentsOrStay = (): void => {
        if (checkIfResponseIsReceived()) {
            if (
                fetchSpacesByUserUpcomingAppointmentsSuccessResponse?.data.length === 0 &&
                !myAppointmentsPageIsLoaded
            ) {
                navigate('/my-appointments/outdated');
            } else {
                dispatch({ type: ReduxCommonActions.SET_MY_APPOINTMENTS_PAGE_IS_LOADED_TO_TRUE });
            }
        }
    };
    const renderReloadOnError = (): JSX.Element | void => {
        if (fetchSpacesByUserUpcomingAppointmentsFailureResponse) {
            return (
                <div
                    className="reload-button-icon"
                    style={{
                        background: 'url(/images/icons/icon-refresh.png)',
                        width: '60px',
                        height: '60px',
                        backgroundSize: 'cover',
                    }}
                    onClick={fetchSpacesForUserUpcomingAppointments}
                />
            );
        }
        // should reload actually reload the entire page from browser or should it  just dispatch again ? guess dispatching is smoother but in that case
        // we will have to annualize error response if successful.
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
