import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import UserPanel from './components/UserPanel';
import AuthModals from './modals/AuthModals';
import { IAction } from './redux/actions/ActionTypes';
import { fetchUserLoginStateAction } from './redux/actions/authActions';
import { fetchCitiesAction } from './redux/actions/cityActions';
import { fetchCurrentUserAction } from './redux/actions/userActions';
import { IReduxState } from './redux/reducers/rootReducer';
import Routes from './routes/AppRoutes';
import './sass/main.scss';
import { isMobile } from './utils/utilFunctions';

function App(): JSX.Element {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const userLoginState = fetchUserLoginStateSuccessResponse?.data;
    const dispatch: Dispatch<IAction> = useDispatch();
    const requestAppData = useCallback(() => {
        dispatch(fetchUserLoginStateAction());
        dispatch(fetchCitiesAction());
    }, [dispatch]);
    const applyEffectsOnInit = (): void => {
        requestAppData();
    };
    const requestCurrentUserIfLoggedInAndConfirmed = (): void => {
        if (userLoginState?.confirmed) {
            dispatch(fetchCurrentUserAction());
        }
    };

    useEffect(applyEffectsOnInit, [requestAppData]);
    useEffect(requestCurrentUserIfLoggedInAndConfirmed, [userLoginState, dispatch]);
    // NOTE чтобы обратиться к данным клиента исп console.log(navigator.userAgent);
    // чтобы обратиться к размеру экрана например для того чтобы код тупо не
    // выполнялся (к примеру зачем инициализировать slider который не будет отображаться)
    // использ windows.width (по моему)

    return (
        <div className="App">
            <div className="navbar-and-page">
                <Navbar />
                <Routes />
            </div>
            <AuthModals />
            {isMobile() ? <UserPanel /> : <Footer />}
        </div>
    );
}

export default App;
