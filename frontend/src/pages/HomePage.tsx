import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Filters from '../components/Filters';
import { IReduxState } from '../redux/reducers/rootReducer';
import { updateDocumentTitle } from '../utils/utilFunctions';

export function HomePage() {
    const { userLoginState } = useSelector((state: IReduxState) => state.authStorage);

    const handleDocumentTitle = () => {
        let documentTitle: string;
        userLoginState
            ? (documentTitle = 'Spaceboo | Пространства бесконтактно')
            : (documentTitle = 'Spaceboo | Добро пожаловать');

        updateDocumentTitle(documentTitle);
    };

    useEffect(handleDocumentTitle, [userLoginState]);

    return (
        <section className="section-homepage">
            <div className="slider"></div>
            <Filters />
        </section>
    );
}
