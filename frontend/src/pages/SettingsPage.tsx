import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IReduxState } from '../redux/reducers/rootReducer';

export default function SettingsPage(): JSX.Element {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const userLoginState = fetchUserLoginStateSuccessResponse?.data;

    if (!userLoginState?.loggedIn) {
        return <Navigate to="/login" />;
    }
    return <> Настройки </>;
}
