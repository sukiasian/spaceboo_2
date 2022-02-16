import { Routes, Route } from 'react-router-dom';
import ActiveAppointmentsPage from '../pages/ActiveAppointmentsPage';
import OutdatedAppointmentsPage from '../pages/OutdatedAppointmentsPage';
import UpcomingAppointmentsPage from '../pages/UpcomingAppointmentsPage';

export default function MyAppointmentsPageRoutes(): JSX.Element {
    return (
        <Routes>
            <Route path="/outdated" element={<OutdatedAppointmentsPage />} />
            <Route path="active" element={<ActiveAppointmentsPage />} />
            <Route path="upcoming" element={<UpcomingAppointmentsPage />} />
        </Routes>
    );
}
