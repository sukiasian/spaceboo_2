import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { IReduxState } from '../redux/reducers/rootReducer';
import { UrlPathname } from '../types/types';

// TODO in backend: we need to get count of unprocessed requests
export default function AdminPanelSideBar(): JSX.Element {
    const { fetchUnprocessedRequestsAmountSuccessResponse } = useSelector((state: IReduxState) => state.adminStorage);
    const requestsAmount = fetchUnprocessedRequestsAmountSuccessResponse?.data;

    return (
        <aside className="side-bar admin-panel-side-bar">
            <h2>Панель администратора</h2>
            <div className="admin-panel-side-bar__links">
                <div className="link-container">
                    <NavLink to={UrlPathname.ADMIN_PANEL_REQUESTS}>Запросы ({requestsAmount || 0})</NavLink>
                </div>
                <div className="link-container">
                    <NavLink to={UrlPathname.ADMIN_PANEL_CONTROL}>Управление</NavLink>
                </div>
            </div>
        </aside>
    );
}
