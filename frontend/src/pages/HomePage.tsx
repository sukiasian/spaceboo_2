import { MutableRefObject, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Filters from '../components/Filters';
import Slider from '../components/Slider';
import Space from '../components/Space';
import { fetchSpacesAction, setFetchSpacesQueryDataAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { updateDocumentTitle } from '../utils/utilFunctions';

export function HomePage() {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const { fetchSpacesQueryData, fetchSpacesSuccessResponse } = useSelector(
        (state: IReduxState) => state.spaceStorage
    );
    const userLoginState = fetchUserLoginStateSuccessResponse?.data;
    const sliderIntervalRef = useRef<NodeJS.Timeout>();
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

        dispatch(setFetchSpacesQueryDataAction(newFetchSpacesQueryData));
    };
    const applyEffectsOnInit = (): (() => void) => {
        updateFetchSpacesQueryDataCityIdOnInit();

        return () => {};
    };
    const requestSpaces = (): void => {
        dispatch(fetchSpacesAction(fetchSpacesQueryData));
    };
    const checkIfSpacesExistToRender = (): boolean => {
        return fetchSpacesSuccessResponse && fetchSpacesSuccessResponse.data.length !== 0 ? true : false;
    };
    const renderSlider = (): JSX.Element => {
        return <Slider sliderIntervalRef={sliderIntervalRef as MutableRefObject<NodeJS.Timeout>} />;
    };
    const renderSpaces = (): JSX.Element => {
        if (checkIfSpacesExistToRender()) {
            const spaces = fetchSpacesSuccessResponse!.data.map((space: any, i: number) => {
                return <Space space={space} index={i} key={i} />;
            });

            return <div className="spaces">{spaces}</div>;
        }

        return <></>;
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(handleDocumentTitle, [userLoginState]);
    useEffect(requestSpaces, [fetchSpacesQueryData, dispatch]);

    return (
        <section className="page home-page-section">
            {renderSlider()}
            <Filters />
            <section className="spaces-section"> {renderSpaces()}</section>
        </section>
    );
}
