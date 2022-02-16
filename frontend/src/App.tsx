import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { IAction } from './redux/actions/ActionTypes';
import { fetchUserLoginStateAction } from './redux/actions/authActions';
import { fetchCitiesAction } from './redux/actions/cityActions';
import { fetchCurrentUserAction } from './redux/actions/userActions';
import { IReduxState } from './redux/reducers/rootReducer';
import Routes from './routes/HomePageRoutes';
import './sass/main.scss';

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
            <section className="section-navbar">
                <Navbar />
            </section>
            <Routes />
            <section className="section-footer">
                <Footer />
            </section>
        </div>
    );
}

export default App;
