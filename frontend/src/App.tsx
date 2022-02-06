import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { IAction } from './redux/actions/ActionTypes';
import { requestUserLoginState } from './redux/actions/authActions';
import { requestCitiesAction } from './redux/actions/cityActions';
import Routes from './routes/Routes';
import './sass/main.scss';

// FIXME any, any - types for props
function App(): JSX.Element {
    const dispatch: Dispatch<IAction> = useDispatch();
    const requestAppData = useCallback(() => {
        dispatch(requestUserLoginState());
        dispatch(requestCitiesAction());
    }, [dispatch]);
    const applyEffectsOnInit = (): void => {
        requestAppData();
    };

    useEffect(applyEffectsOnInit, [requestAppData]);
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
