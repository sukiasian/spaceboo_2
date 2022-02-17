import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import RefreshButton from '../buttons/RefreshButton';
import Space from '../components/Space';
import { toggleMyAppointmentsFinalLocationIsDefined } from '../redux/actions/commonActions';
import { fetchSpacesByUserActiveAppointments } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';

export default function ActiveAppointmentsPage(): JSX.Element {
    const { fetchSpacesByUserActiveAppointmentsSuccessResponse, fetchSpacesByUserActiveAppointmentsFailureResponse } =
        useSelector((state: IReduxState) => state.spaceStorage);
    const { myAppointmentsFinalLocationIsDefined } = useSelector((state: IReduxState) => state.commonStorage);
    const spaces = fetchSpacesByUserActiveAppointmentsSuccessResponse?.data;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const fetchSpacesForUserActiveAppointments = (): void => {
        dispatch(fetchSpacesByUserActiveAppointments());
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
    const renderReloadOnError = (): JSX.Element | void => {
        if (fetchSpacesByUserActiveAppointmentsFailureResponse) {
            return <RefreshButton />;
        }
    };
    const renderSpacesForActiveAppointments = (): JSX.Element[] => {
        return spaces?.map((space: any, i: number) => {
            return (
                <Space
                    spaceId={space.id}
                    mainImageUrl={space.imagesUrl[0]}
                    price={space.price}
                    roomsNumber={space.roomsNumber}
                    city={space.city}
                    address={space.address}
                />
            );
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
            <div className="spaces-by-appointments">{renderSpacesForActiveAppointments()}</div>
            <div className="upcoming-appointments__reload"> {renderReloadOnError()}</div>
        </div>
    );
}
