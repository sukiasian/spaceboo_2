import { Routes, Route } from 'react-router-dom';
import AdminPanelControl from '../components/AdminPanelControl';
import AdminPanelRequests from '../components/AdminPanelRequests';

export default function AdminPanelRoutes(): JSX.Element {
    return (
        <Routes>
            <Route path="requests" element={<AdminPanelRequests />} />
            <Route path="control" element={<AdminPanelControl />} />
        </Routes>
    );
}
