import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    annualizeFoundBySearchPatternCitiesAction,
    requestCitiesBySearchPatternAction,
} from '../redux/actions/cityActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IComponentClassNameProps, TActiveTab } from '../types/types';

type ICityPickerProps = TActiveTab & IComponentClassNameProps;

export default function CityPicker(props: ICityPickerProps): JSX.Element {
    const { handleActiveTab, mainDivClassName } = props;
    const [currentCity, setCurrentCity] = useState('Город');
    const [cityPickerBoxIsOpen, setCityPickerBoxIsOpen] = useState(false);
    const { foundBySearchPatternCities } = useSelector((state: IReduxState) => state.cityStorage);

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
    const pickCurrentCity = (value: string, cityId: number): (() => void) => {
        return () => {
            setCityPickerBoxIsOpen(false);
            setCurrentCity(value);
            annualizeFoundBySearchPatternCities();
            localStorage.setItem('currentCity', value);
            localStorage.setItem('currentCityId', cityId.toString());
        };
    };
    const handlePickCity = (cityValue: string, cityId: number): (() => void) => {
        return () => {
            handleActiveTab('city');
            pickCurrentCity(cityValue, cityId)();
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
                              onClick={handlePickCity(city.city || city.address, city.id)}
                          >
                              {city.address}
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
