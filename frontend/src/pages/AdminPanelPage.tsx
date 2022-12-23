import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanelSideBar from '../components/AdminPanelSideBar';
import AdminPanelRoutes from '../routes/AdminPanelRoutes';

export default function AdminPanelPage(): JSX.Element {
    const navigate = useNavigate();

    const linkPathIsNotDefined =
        !window.location.pathname.includes('admin-panel/requests') &&
        !window.location.pathname.includes('admin-panel/control');

    const redirectToRequestsOnInit = (): void => {
        if (linkPathIsNotDefined) {
            navigate('/admin-panel/requests');
        }
    };

    useEffect(redirectToRequestsOnInit, []);

    return (
        <div className="admin-panel-page">
            <div className="with-side-bar">
                <AdminPanelSideBar />
                <AdminPanelRoutes />
            </div>
        </div>
    );
}
