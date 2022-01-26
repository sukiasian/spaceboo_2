import { MutableRefObject, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Filters from '../components/Filters';
import Slider from '../components/Slider';
import Space from '../components/Space';
import { requestSpacesAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { updateDocumentTitle } from '../utils/utilFunctions';

export function HomePage() {
    const sliderIntervalRef = useRef<NodeJS.Timeout>();
    const { userLoginState } = useSelector((state: IReduxState) => state.authStorage);
    const { fetchSpacesSuccessResponse, fetchSpacesFailureResponse } = useSelector(
        (state: IReduxState) => state.spaceStorage
    );
    const dispatch = useDispatch();
    const handleDocumentTitle = () => {
        let documentTitle: string;
        userLoginState
            ? (documentTitle = 'Spaceboo | Пространства бесконтактно')
            : (documentTitle = 'Spaceboo | Добро пожаловать');

        updateDocumentTitle(documentTitle);
    };
    const applyEffectsOnInit = (): (() => void) => {
        return () => {
            dispatch(requestSpacesAction());
        };
    };
    const checkIfSpacesExistToRender = (): boolean => {
        return fetchSpacesSuccessResponse && fetchSpacesSuccessResponse.data.length !== 0 ? true : false;
    };
    const renderSlider = (): JSX.Element => {
        return <Slider sliderIntervalRef={sliderIntervalRef as MutableRefObject<NodeJS.Timeout>} />;
    };
    const renderSpaces = (): JSX.Element => {
        if (checkIfSpacesExistToRender()) {
            return fetchSpacesSuccessResponse!.data.map((space: any) => {
                return (
                    <Space
                        mainImageUrl={space.imagesUrl[0]}
                        price={space.pricePerNight}
                        roomsNumber={space.roomsNumber}
                        city={space.city.city || space.city.address}
                        address={space.address}
                    />
                );
            });
        }

        return <></>;
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(handleDocumentTitle, [userLoginState]);

    return (
        <section className="homepage-section">
            {renderSlider()}
            <Filters />
            <section className="spaces-section"> {renderSpaces()}</section>
        </section>
    );
}
