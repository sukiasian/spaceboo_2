import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDispatch } from 'react-redux';
import { deleteCancelAppointmentAction } from '../redux/actions/appointmentActions';

export default function UpcomingAppointmentsControlPanel(): JSX.Element {
    const dispatch = useDispatch();
    const handleCancelAppointment = (): void => {
        dispatch(deleteCancelAppointmentAction());
    };

    return (
        <div className="upcoming-appointments-control-panel">
            <div className="cancel-appointment" onClick={handleCancelAppointment}>
                <FontAwesomeIcon icon={faTimes} />
            </div>
        </div>
    );
}
