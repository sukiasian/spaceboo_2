import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function CalendarIcon(): JSX.Element {
    return (
        <div className="icon-container calendar-icon-container">
            <FontAwesomeIcon icon={faCalendar} />
        </div>
    );
}


