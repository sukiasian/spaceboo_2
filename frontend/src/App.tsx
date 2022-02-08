import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { IAction } from './redux/actions/ActionTypes';
import { requestUserLoginStateAction } from './redux/actions/authActions';
import { requestCitiesAction } from './redux/actions/cityActions';
import { requestCurrentUserAction } from './redux/actions/userActions';
import { IReduxState } from './redux/reducers/rootReducer';
import Routes from './routes/Routes';
import './sass/main.scss';

// FIXME any, any - types for props
function App(): JSX.Element {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const userLoginState = fetchUserLoginStateSuccessResponse?.data;
    const dispatch: Dispatch<IAction> = useDispatch();
    const requestAppData = useCallback(() => {
        dispatch(requestUserLoginStateAction());
        dispatch(requestCitiesAction());
    }, [dispatch]);
    const applyEffectsOnInit = (): void => {
        requestAppData();
    };
    const requestCurrentUserIfLoggedInAndConfirmed = (): void => {
        if (userLoginState?.confirmed) {
            dispatch(requestCurrentUserAction());
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
