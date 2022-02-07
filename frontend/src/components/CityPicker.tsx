import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    annualizeFoundBySearchPatternCitiesAction,
    requestCitiesBySearchPatternAction,
} from '../redux/actions/cityActions';
import { requestSpacesAction, setFetchSpacesQueryDataAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IComponentClassNameProps, TActiveTab } from '../types/types';

type ICityPickerProps = TActiveTab & IComponentClassNameProps;

export default function CityPicker(props: ICityPickerProps): JSX.Element {
    const { handleActiveTab, mainDivClassName } = props;
    const [currentCity, setCurrentCity] = useState('Город');
    const [cityPickerBoxIsOpen, setCityPickerBoxIsOpen] = useState(false);
    const { foundBySearchPatternCities } = useSelector((state: IReduxState) => state.cityStorage);
    const { fetchSpacesQueryData } = useSelector((state: IReduxState) => state.spaceStorage);
    const dispatch = useDispatch();
    const getCurrentCityFromLocalStorage = (): void => {
        const currentCity = localStorage.getItem('currentCity');

        if (currentCity) {
            setCurrentCity(currentCity);
        }
    };
    const applyEffectsOnInit = (): void => {
        getCurrentCityFromLocalStorage();
    };
    const toggleCityPickerBox = (): void => {
        setCityPickerBoxIsOpen(!cityPickerBoxIsOpen);
    };
    const handleFindCityInput = (e: ChangeEvent<{ value: string }>): void => {
        dispatch(requestCitiesBySearchPatternAction(e.target.value));
    };
    const annualizeFoundBySearchPatternCities = (): void => {
        dispatch(annualizeFoundBySearchPatternCitiesAction());
    };
    const pickCurrentCity = (city: any): void => {
        setCityPickerBoxIsOpen(false);
        setCurrentCity(city.name);
        annualizeFoundBySearchPatternCities();
        localStorage.setItem('currentCity', city.name);
        // NOTE maybe pas an object to currentCity instead of the line below? guess we can only store strings
        localStorage.setItem('currentCityId', city.id.toString());
        // FIXME NOTE

        dispatch(requestSpacesAction({ cityId: city.id }));
    };
    const handlePickCity = (city: any): (() => void) => {
        return () => {
            handleActiveTab('city');
            pickCurrentCity(city);
        };
    };
    const renderFindCityResults = (): JSX.Element => {
        return (
            <>
                {foundBySearchPatternCities && foundBySearchPatternCities.length !== 0
                    ? foundBySearchPatternCities.map((city: any, i: number) => (
                          <p
                              className={`city-picker__search-results city-picker__search-results--${i}`}
                              key={i}
                              onClick={handlePickCity(city)}
                          >
                              {city.name}
                          </p>
                      ))
                    : null}
            </>
        );
    };
    const renderCityPickerBox = (): JSX.Element | void => {
        if (cityPickerBoxIsOpen) {
            return (
                <section className="city-picker">
                    <div className="city-picker__search">
                        <input
                            className="city-picker__input"
                            name="city-picker__input"
                            placeholder="Введите название города..."
                            onChange={handleFindCityInput}
                            autoComplete="off"
                        />
                        {renderFindCityResults()}
                    </div>
                </section>
            );
        }
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div className={mainDivClassName}>
            <h3 className="heading--tertiary" onClick={toggleCityPickerBox}>
                {currentCity}
            </h3>
            {renderCityPickerBox()}
        </div>
    );
}
