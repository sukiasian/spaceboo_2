import { ChangeEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { annualizeFoundBySearchPatternCitiesAction } from '../redux/actions/cityActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IComponentDivProps, ReduxCitiesActions, SagaTasks } from '../types/types';

interface ICityPickerProps extends IComponentDivProps {}

// TODO localstorage (persist) plus majorcities
export default function CityPicker(props: ICityPickerProps): JSX.Element {
    const [currentCity, setCurrentCity] = useState('Город');
    const [cityPickerBoxIsOpen, setCityPickerBoxIsOpen] = useState(false);
    const { foundBySearchPatternCities } = useSelector((state: IReduxState) => state.cityStorage);
    const majorCities = ['Москва', 'Краснодар', 'Сочи', 'Новосибирск', 'Санкт-Петербург', 'Красноярск'];
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
        dispatch({ type: SagaTasks.REQUEST_CITIES_BY_SEARCH_PATTERN, payload: e.target.value });
    };
    const annualizeFoundBySearchPatternCities = (): void => {
        dispatch(annualizeFoundBySearchPatternCitiesAction());
    };
    const pickCurrentCity = (value: string): (() => void) => {
        return (): void => {
            setCityPickerBoxIsOpen(false);
            setCurrentCity(value);
            annualizeFoundBySearchPatternCities();
            localStorage.setItem('currentCity', value);
        };
    };
    const renderFindCityResults = (): JSX.Element => {
        return (
            <>
                {foundBySearchPatternCities && foundBySearchPatternCities.length !== 0
                    ? foundBySearchPatternCities.map((city: any, i: number) => (
                          <div
                              className={`city-picker__search-results city-picker__search-results--${i}`}
                              key={i}
                              onClick={pickCurrentCity(city.city || city.address)}
                          >
                              {city.address}
                          </div>
                      ))
                    : renderMajorCities}
            </>
        );
    };
    const renderMajorCities = majorCities.map((city: string, i: number) => {
        return (
            <div className={`major-cities major-cities--${i}`} onClick={pickCurrentCity(city)} key={i}>
                {city}
            </div>
        );
    });
    const renderCityPickerBox = (): JSX.Element => {
        return (
            <section className="city-picker">
                <div className="city-picker__search">
                    <input
                        className="city-picker__input"
                        name="city-picker__input"
                        placeholder="Введите название города..."
                        onChange={handleFindCityInput}
                    />
                    {renderFindCityResults()}
                </div>
            </section>
        );
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div className={props.mainDivClassName}>
            <h3 className="heading--tertiary" onClick={toggleCityPickerBox}>
                {currentCity}
            </h3>
            {cityPickerBoxIsOpen ? renderCityPickerBox() : null}
        </div>
    );
}
