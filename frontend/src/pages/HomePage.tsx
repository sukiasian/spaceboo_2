import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Filters from '../components/Filters';
import { IReduxState } from '../redux/reducers/rootReducer';
import { updateDocumentTitle } from '../utils/utilFunctions';

export function HomePage() {
    const { userIsLoggedIn } = useSelector((state: IReduxState) => state.authStorage);
    const handleDocumentTitle = () => {
        let documentTitle: string;
        userIsLoggedIn
            ? (documentTitle = 'Spaceboo | Пространства бесконтактно')
            : (documentTitle = 'Spaceboo | Добро пожаловать');

        updateDocumentTitle(documentTitle);
    };

    useEffect(handleDocumentTitle, [userIsLoggedIn]);

    return (
        <section className="section-homepage">
            <div className="slider"></div>
            <Filters />
        </section>
    );
}
