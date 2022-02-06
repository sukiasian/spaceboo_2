import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Filters, { IQueryData } from '../components/Filters';
import Slider from '../components/Slider';
import Space from '../components/Space';
import { requestSpacesAction, setFetchSpacesQueryData } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { updateDocumentTitle } from '../utils/utilFunctions';

export function HomePage() {
    const [queryData, setQueryData] = useState<IQueryData>();
    const { userLoginState } = useSelector((state: IReduxState) => state.authStorage);
    const { fetchSpacesQueryData, fetchSpacesSuccessResponse } = useSelector(
        (state: IReduxState) => state.spaceStorage
    );
    const sliderIntervalRef = useRef<NodeJS.Timeout>();
    // NOTE может стоит держать здесь queryData?
    const dispatch = useDispatch();
    const handleDocumentTitle = () => {
        let documentTitle: string;
        userLoginState
            ? (documentTitle = 'Spaceboo | Пространства бесконтактно')
            : (documentTitle = 'Spaceboo | Добро пожаловать');

        updateDocumentTitle(documentTitle);
    };
    const updateFetchSpacesQueryDataCityIdOnInit = (): void => {
        const newFetchSpacesQueryData = { ...fetchSpacesQueryData };

        newFetchSpacesQueryData.cityId = localStorage.getItem('currentCityId') || '';

        dispatch(setFetchSpacesQueryData(newFetchSpacesQueryData));
    };
    const applyEffectsOnInit = (): (() => void) => {
        updateFetchSpacesQueryDataCityIdOnInit();

        return () => {};
    };
    const requestSpaces = (): void => {
        dispatch(requestSpacesAction(fetchSpacesQueryData));
    };
    const checkIfSpacesExistToRender = (): boolean => {
        return fetchSpacesSuccessResponse && fetchSpacesSuccessResponse.data.length !== 0 ? true : false;
    };
    const renderSlider = (): JSX.Element => {
        return <Slider sliderIntervalRef={sliderIntervalRef as MutableRefObject<NodeJS.Timeout>} />;
    };
    const renderSpaces = (): JSX.Element => {
        if (checkIfSpacesExistToRender()) {
            return fetchSpacesSuccessResponse!.data.map((space: any, i: number) => {
                return (
                    <Space
                        spaceId={space.id}
                        mainImageUrl={space.imagesUrl[0]}
                        price={space.pricePerNight}
                        roomsNumber={space.roomsNumber}
                        city={space.city.city || space.city.address}
                        address={space.address}
                        key={i}
                    />
                );
            });
        }

        return <></>;
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(handleDocumentTitle, [userLoginState]);
    useEffect(requestSpaces, [fetchSpacesQueryData, dispatch]);

    return (
        <section className="home-page-section">
            {renderSlider()}
            <Filters />
            <section className="spaces-section"> {renderSpaces()}</section>
        </section>
    );
}
