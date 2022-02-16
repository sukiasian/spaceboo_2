import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    fetchSpacesByUserActiveAppointments,
    fetchSpacesByUserUpcomingAppointments,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { ReduxCommonActions } from '../types/types';

export default function ActiveAppointmentsPage(): JSX.Element {
    const { fetchSpacesByUserActiveAppointmentsSuccessResponse, fetchSpacesByUserActiveAppointmentsFailureResponse } =
        useSelector((state: IReduxState) => state.spaceStorage);
    const { myAppointmentsPageIsLoaded } = useSelector((state: IReduxState) => state.commonStorage);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fetchSpacesForUserActiveAppointments = (): void => {
        dispatch(fetchSpacesByUserActiveAppointments());
    };
    const applyEffectsOnInit = (): void => {
        fetchSpacesForUserActiveAppointments();
    };
    const checkIfResponseIsReceived = (): boolean => {
        return fetchSpacesByUserActiveAppointmentsSuccessResponse || fetchSpacesByUserActiveAppointmentsFailureResponse
            ? true
            : false;
    };
    const navigateToOutdatedAppointmentsOrStay = (): void => {
        if (checkIfResponseIsReceived()) {
            if (fetchSpacesByUserActiveAppointmentsSuccessResponse?.data.length === 0 && !myAppointmentsPageIsLoaded) {
                navigate('/my-appointments/upcoming');
            } else {
                dispatch({ type: ReduxCommonActions.SET_MY_APPOINTMENTS_PAGE_IS_LOADED_TO_TRUE });
            }
        }
    };
    const renderReloadOnError = (): JSX.Element | void => {
        if (fetchSpacesByUserActiveAppointmentsFailureResponse) {
            return (
                <div
                    className="reload-button-icon"
                    style={{
                        background: 'url(/images/icons/icon-refresh.png)',
                        width: '60px',
                        height: '60px',
                        backgroundSize: 'cover',
                    }}
                    onClick={fetchSpacesForUserActiveAppointments}
                />
            );
        }
        // should reload actually reload the entire page from browser or should it  just dispatch again ? guess dispatching is smoother but in that case
        // we will have to annualize error response if successful.
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(navigateToOutdatedAppointmentsOrStay, [
        fetchSpacesByUserActiveAppointmentsSuccessResponse,
        fetchSpacesByUserActiveAppointmentsFailureResponse,
        navigate,
        dispatch,
    ]);

    return (
        <div className="upcoming-appointments">
            <div className="upcoming-appointments__reload"> {renderReloadOnError()}</div>
        </div>
    );
}
