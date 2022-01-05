import { MutableRefObject, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Filters from '../components/Filters';
import Slider from '../components/Slider';
import { IReduxState } from '../redux/reducers/rootReducer';
import { updateDocumentTitle } from '../utils/utilFunctions';

export function HomePage() {
    const sliderIntervalRef = useRef<NodeJS.Timeout>();
    const { userLoginState } = useSelector((state: IReduxState) => state.authStorage);
    const handleDocumentTitle = () => {
        let documentTitle: string;
        userLoginState
            ? (documentTitle = 'Spaceboo | Пространства бесконтактно')
            : (documentTitle = 'Spaceboo | Добро пожаловать');

        updateDocumentTitle(documentTitle);
    };
    const render = (): JSX.Element => {
        return <Slider sliderIntervalRef={sliderIntervalRef as MutableRefObject<NodeJS.Timeout>} />;
    };

    useEffect(handleDocumentTitle, [userLoginState]);

    return (
        <section className="homepage-section">
            {render()}
            <div className="slider"></div>
            <Filters />
        </section>
    );
}
