import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpacesByUserUpcomingAppointments } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { ReduxCommonActions } from '../types/types';

export default function OutdatedAppointmentsPage(): JSX.Element {
    const {
        fetchSpacesByUserOutdatedAppointmentsSuccessResponse,
        fetchSpacesByUserOutdatedAppointmentsFailureResponse,
    } = useSelector((state: IReduxState) => state.spaceStorage);
    const dispatch = useDispatch();
    const fetchSpacesForUserUpcomingAppointments = (): void => {
        dispatch(fetchSpacesByUserUpcomingAppointments());
    };
    const setMyAppointmentsPageIsLoadedToTrue = () => {
        dispatch({ type: ReduxCommonActions.SET_MY_APPOINTMENTS_PAGE_IS_LOADED_TO_TRUE });
    };
    const applyEffectsOnInit = (): void => {
        fetchSpacesForUserUpcomingAppointments();
        setMyAppointmentsPageIsLoadedToTrue();
    };

    const renderReloadOnError = (): JSX.Element | void => {
        if (fetchSpacesByUserOutdatedAppointmentsFailureResponse) {
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

    return (
        <div className="upcoming-appointments">
            <div className="upcoming-appointments__reload"> {renderReloadOnError()}</div>
        </div>
    );
}
function useNavigate() {
    throw new Error('Function not implemented.');
}
