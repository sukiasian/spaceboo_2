import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Filters from '../components/Filters';
import Slider from '../components/Slider';
import QueriedSpaces from '../components/QueriedSpaces';
import { IReduxState } from '../redux/reducers/rootReducer';
import { updateDocumentTitle } from '../utils/utilFunctions';

export function HomePage() {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);

    const sliderIntervalRef = useRef<NodeJS.Timeout>();

    const userLoginState = fetchUserLoginStateSuccessResponse?.data;

    const handleDocumentTitle = () => {
        let documentTitle: string;
        userLoginState
            ? (documentTitle = 'Spaceboo | Пространства бесконтактно')
            : (documentTitle = 'Spaceboo | Добро пожаловать');

        updateDocumentTitle(documentTitle);
    };

    useEffect(handleDocumentTitle, [userLoginState]);

    return (
        <section className="page home-page-section">
            <Slider sliderIntervalRef={sliderIntervalRef as MutableRefObject<NodeJS.Timeout>} />
            <Filters />
            <QueriedSpaces />
        </section>
    );
}
