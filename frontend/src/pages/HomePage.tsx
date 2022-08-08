import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Filters from '../components/Filters';
import LoadingSpin from '../components/LoadingSpin';
import Slider from '../components/Slider';
import Space from '../components/Space';
import Spaces from '../components/Spaces';
import {
    annualizeFetchSpacesQueryDataAction,
    annualizeFetchSpacesResponsesAction,
    fetchSpacesAction,
    setFetchSpacesQueryDataAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { QueryDefaultValue } from '../types/types';
import { updateDocumentTitle } from '../utils/utilFunctions';

export function HomePage() {
    const [spacesAreRequested, setSpacesAreRequested] = useState(false);
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const { fetchSpacesQueryData, fetchSpacesSuccessResponse: fetchedSpaces } = useSelector(
        (state: IReduxState) => state.spaceStorage
    );
    const spacesRef = useRef<HTMLDivElement>(null);
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
    const increasePage = (): void => {
        dispatch(setFetchSpacesQueryDataAction({ ...fetchSpacesQueryData, page: fetchSpacesQueryData.page! + 1 }));
    };
    const annualizeSpacesAndQueryData = (): void => {
        dispatch(annualizeFetchSpacesResponsesAction());
        dispatch(annualizeFetchSpacesQueryDataAction());
    };
    const handleScrollForFetchingSpaces = (): void => {
        if (fetchedSpaces) {
            window.onscroll = () => {
                const footer = document.querySelector('footer');

                const isScrolledToThePoint = (): boolean => {
                    return (
                        document.documentElement.scrollTop + window.innerHeight >=
                        document.documentElement.scrollHeight - footer!.clientHeight
                    );
                };
                const isReadyToRequestMoreSpaces = (): boolean => {
                    return fetchedSpaces &&
                        fetchedSpaces.length !== 0 &&
                        fetchedSpaces.length % QueryDefaultValue.LIMIT === 0
                        ? true
                        : false;
                };

                if (isScrolledToThePoint() && isReadyToRequestMoreSpaces() && !spacesAreRequested) {
                    setSpacesAreRequested(true);
                    increasePage();

                    window.onscroll = null;
                }
            };
        }
    };
    const checkIfSpacesExistToRender = (): boolean => {
        return fetchedSpaces && fetchedSpaces.length !== 0 ? true : false;
    };
    const renderSpaces = (): JSX.Element => {
        if (checkIfSpacesExistToRender()) {
            const spaces = fetchedSpaces!.map((space: any, i: number) => {
                return <Space space={space} index={i} key={i} />;
            });

            return (
                <div className="spaces" ref={spacesRef}>
                    {spaces}
                </div>
            );
        }

        return <></>;
    };

    useEffect(handleDocumentTitle, [userLoginState]);

    return (
        <section className="page home-page-section">
            <Slider sliderIntervalRef={sliderIntervalRef as MutableRefObject<NodeJS.Timeout>} />
            <Filters />
            <Spaces />
        </section>
    );
}
