import { useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { IAction } from './redux/actions/ActionTypes';
import { requestUserIsLoggedInAction } from './redux/actions/authActions';
import { requestCitiesAction } from './redux/actions/cityActions';
import { requestSpacesAction } from './redux/actions/spaceActions';
import Routes from './routes/Routes';

// FIXME any, any - types for props
function App(): JSX.Element {
    const dispatch: Dispatch<IAction> = useDispatch();
    const requestAppData = useCallback(() => {
        dispatch(requestUserIsLoggedInAction());
        dispatch(requestSpacesAction());
        dispatch(requestCitiesAction());
    }, [dispatch]);
    const applyEffectsOnInit = (): void => {
        requestAppData();
    };

    useEffect(applyEffectsOnInit, [requestAppData]);

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
