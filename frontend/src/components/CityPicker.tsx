import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    annualizeFoundBySearchPatternCitiesAction,
    fetchCitiesBySearchPatternAction,
} from '../redux/actions/cityActions';
import {
    annualizeFetchSpacesQueryDataAction,
    annualizeFetchSpacesResponsesAction,
    fetchSpacesAction,
} from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IComponentClassNameProps, TActiveTab } from '../types/types';
import { separateCityNameFromRegionIfCityNameContains } from '../utils/utilFunctions';

type ICityPickerProps = TActiveTab & IComponentClassNameProps;

// TODO добавить функционал outside click to close search results
export default function CityPicker(props: ICityPickerProps): JSX.Element {
    const { handleActiveTab, mainDivClassName } = props;
    const [currentCity, setCurrentCity] = useState('Город');
    const [cityPickerInputIsOpen, setCityPickerInputIsOpen] = useState<boolean>();
    const inputRef = useRef<HTMLInputElement>(null);
    const findCityResultsRef = useRef<HTMLDivElement>(null);
    const { fetchCitiesByPatternSuccessResponse } = useSelector((state: IReduxState) => state.cityStorage);
    const dispatch = useDispatch();
    const getCurrentCityFromLocalStorage = (): void => {
        const currentCity = localStorage.getItem('currentCity');

        if (currentCity) {
            setCurrentCity(currentCity);
        }
    };
    const applyEffectsOnInit = (): (() => void) => {
        getCurrentCityFromLocalStorage();

        return () => {
            annualizeFoundBySearchPatternCities();
        };
    };
    const closeFindCityResultsBoxOnOutsideClick = (e: MouseEvent): void => {
        if (cityPickerInputIsOpen && e.target !== findCityResultsRef.current && e.target !== inputRef.current) {
            setCityPickerInputIsOpen(false);
            annualizeFoundBySearchPatternCities();
        }
    };
    const applyEventListeners = (): (() => void) => {
        document.addEventListener('click', closeFindCityResultsBoxOnOutsideClick);

        return () => {
            document.removeEventListener('click', closeFindCityResultsBoxOnOutsideClick);
        };
    };
    const focusOnInputOpening = (): void => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };
    const toggleCityPickerBox = (): void => {
        setCityPickerInputIsOpen(true);
    };
    const handleFindCityInput = (e: ChangeEvent<{ value: string }>): void => {
        if (e.target.value.length >= 3) {
            dispatch(fetchCitiesBySearchPatternAction(e.target.value));
        } else {
            dispatch(annualizeFoundBySearchPatternCitiesAction());
        }
    };
    const annualizeFoundBySearchPatternCities = (): void => {
        dispatch(annualizeFoundBySearchPatternCitiesAction());
    };
    const annualizeFetchedSpaces = (): void => {
        dispatch(annualizeFetchSpacesResponsesAction());
    };
    const annualizeFetchSpacesQueryData = (): void => {
        dispatch(annualizeFetchSpacesQueryDataAction());
    };
    const pickCurrentCity = (city: any): void => {
        setCityPickerInputIsOpen(false);

        localStorage.setItem('currentCity', city.name);
        localStorage.setItem('currentCityId', city.id.toString());

        annualizeFoundBySearchPatternCities();
        annualizeFetchedSpaces();
        annualizeFetchSpacesQueryData();

        setCurrentCity(city.name);
    };
    const handlePickCity = (city: any): (() => void) => {
        return () => {
            handleActiveTab('city');
            pickCurrentCity(city);
        };
    };
    const renderFindCityResults = (): JSX.Element | void => {
        // здесь должна быть проверка на то чтобы  input.value был пустым
        const findCityResults =
            fetchCitiesByPatternSuccessResponse?.data.length !== 0
                ? fetchCitiesByPatternSuccessResponse?.data.map((city: any, i: number) => (
                      <p
                          className={`city-picker__search-result city-picker__search-result--${i}`}
                          key={i}
                          onClick={handlePickCity(city)}
                      >
                          {`${city.region.name}, ${separateCityNameFromRegionIfCityNameContains(city.name)}`}
                      </p>
                  ))
                : null;

        if (cityPickerInputIsOpen && findCityResults) {
            return (
                <div className="city-picker__search-results" ref={findCityResultsRef}>
                    {findCityResults}
                </div>
            );
        }
    };
    const renderCurrentCity = (): JSX.Element | void => {
        if (!cityPickerInputIsOpen) {
            return (
                <h3 className="heading heading--tertiary" onClick={toggleCityPickerBox}>
                    {currentCity}
                </h3>
            );
        }
    };
    const renderCityPickerInput = (): JSX.Element | void => {
        if (cityPickerInputIsOpen) {
            return (
                <section className="city-picker">
                    <div className="city-picker__search">
                        <input
                            className="city-picker__input"
                            name="city-picker"
                            placeholder="Введите название города..."
                            onChange={handleFindCityInput}
                            autoComplete="off"
                            ref={inputRef}
                        />
                    </div>
                </section>
            );
        }
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(focusOnInputOpening);
    useEffect(applyEventListeners);

    return (
        <div id="city-picker" className={mainDivClassName}>
            {renderCurrentCity()}
            {renderCityPickerInput()}
            {renderFindCityResults()}
        </div>
    );
}
