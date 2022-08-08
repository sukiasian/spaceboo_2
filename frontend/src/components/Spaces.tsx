import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../redux/reducers/rootReducer';
import { QueryDefaultValue } from '../types/types';
import Space from './Space';
import {
    annualizeFetchSpacesQueryDataAction,
    annualizeFetchSpacesResponsesAction,
    fetchSpacesAction,
    setFetchSpacesQueryDataAction,
} from '../redux/actions/spaceActions';
import LoadingSpin from './LoadingSpin';

export default function Spaces(): JSX.Element {
    const [spacesAreRequested, setSpacesAreRequested] = useState(false);
    const { fetchSpacesQueryData, fetchSpacesSuccessResponse: fetchedSpaces } = useSelector(
        (state: IReduxState) => state.spaceStorage
    );
    const dispatch = useDispatch();
    const spacesRef = useRef<HTMLDivElement>(null);
    const applyEffectsOnInit = (): (() => void) => {
        return () => {
            annualizeSpacesAndQueryData();

            window.onscroll = null;
        };
    };
    const annualizeSpacesAndQueryData = (): void => {
        dispatch(annualizeFetchSpacesResponsesAction());
        dispatch(annualizeFetchSpacesQueryDataAction());
    };
    const checkIfSpacesExistToRender = (): boolean => {
        return fetchedSpaces && fetchedSpaces.length !== 0 ? true : false;
    };
    const increasePage = (): void => {
        dispatch(setFetchSpacesQueryDataAction({ ...fetchSpacesQueryData, page: fetchSpacesQueryData.page! + 1 }));
    };
    const requestSpaces = (): void => {
        dispatch(fetchSpacesAction(fetchSpacesQueryData));

        setSpacesAreRequested(false);
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

    const renderSpaces = (): JSX.Element[] | JSX.Element => {
        if (checkIfSpacesExistToRender()) {
            return fetchedSpaces!.map((space: any, i: number) => {
                return <Space space={space} index={i} key={i} />;
            });
        }

        return <></>;
    };
    const renderLoadingSpinnerForSpaces = (): JSX.Element | void => {
        if (spacesAreRequested) {
            return <LoadingSpin />;
        }
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(requestSpaces, [fetchSpacesQueryData]);
    useEffect(handleScrollForFetchingSpaces, [fetchedSpaces]);

    return (
        <section className="spaces-section">
            <div className="spaces" ref={spacesRef}>
                {renderSpaces()}
            </div>
            {renderLoadingSpinnerForSpaces()}
        </section>
    );
}
