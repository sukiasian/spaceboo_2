import { ChangeEventHandler, MouseEventHandler, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTimes } from '@fortawesome/free-solid-svg-icons';
import InputWithLabel, { IInputWithLableProps, InputTypes } from './InputWithLabel';
import { useDispatch, useSelector } from 'react-redux';
import QueryDatePicker from './QueryDatePicker';
import { setFetchSpacesQueryDataAction } from '../redux/actions/spaceActions';
import { valueIsNumeric } from '../utils/utilFunctions';
import { IReduxState } from '../redux/reducers/rootReducer';

interface IFilterRange<T> {
    from: T;
    to: T;
}
interface ISortByDropDownOptions {
    field: SpaceQuerySortFields;
    text: string;
}
interface IPriceRangeInput extends IInputWithLableProps {
    priceRangeQueryDataReference: PriceRangeQueryDataReferences;
}
export interface IDatesRange {
    beginningDate?: string;
    endingDate?: string;
}
export interface IQueryData extends IDatesRange {
    page?: string | number;
    limit?: string | number;
    sortBy?: SpaceQuerySortFields;
    priceFrom?: string | number;
    priceTo?: string | number;
    beginningTime?: string;
    endingTime?: string;
    cityId?: string;
}

export enum FilterNames {
    SORT_BY = 'sortBy',
    PRICE = 'price',
    RESERVATION_DATE_PICKER = 'reservationDatePicker',
}
export enum SpaceQuerySortFields {
    PRICEUP = 'priceup',
    PRICEDOWN = 'pricedown',
    OLDEST = 'oldest',
    NEWEST = 'newest',
}
enum PriceRangeQueryDataReferences {
    PRICE_FROM = 'priceFrom',
    PRICE_TO = 'priceTo',
}

export default function Filters(): JSX.Element {
    const [datesForRender, setDatesForRender] = useState<IDatesRange>();
    const [sortByDropDownBoxIsOpen, setSortByDropDownBoxIsOpen] = useState(false);
    const [priceRangeDropDownBoxIsOpen, setPriceRangeDropDownBoxIsOpen] = useState(false);
    const [requiredReservationDatesPickerIsOpen, setRequiredReservationDatesPickerIsOpen] = useState(false);
    const sortByDropDownOptions: ISortByDropDownOptions[] = [
        {
            field: SpaceQuerySortFields.PRICEDOWN,
            text: 'Цена по убыванию',
        },
        {
            field: SpaceQuerySortFields.PRICEUP,
            text: 'Цена по возрастанию',
        },
        {
            field: SpaceQuerySortFields.OLDEST,
            text: 'Сначала старые',
        },
        {
            field: SpaceQuerySortFields.NEWEST,
            text: 'Сначала новые',
        },
    ];
    const { fetchSpacesQueryData } = useSelector((state: IReduxState) => state.spaceStorage);
    const annualizeDatesIconRef = useRef<HTMLSpanElement>(null);
    const priceRangeInputs: IPriceRangeInput[] = [
        {
            inputLabel: 'От',
            mainDivClassName: 'price-range',
            inputClassName: 'price-range-from',
            inputName: 'price-range-from',
            priceRangeQueryDataReference: PriceRangeQueryDataReferences.PRICE_FROM,
        },
        {
            inputLabel: 'До',
            mainDivClassName: 'price-range',
            inputClassName: 'price-range-to',
            inputName: 'price-range-to',
            priceRangeQueryDataReference: PriceRangeQueryDataReferences.PRICE_TO,
        },
    ];
    const dispatch = useDispatch();
    const toggleFilterBoxIsOpen = (filter: FilterNames): MouseEventHandler => {
        return (e): void => {
            switch (filter) {
                case FilterNames.SORT_BY:
                    setSortByDropDownBoxIsOpen((prev) => !prev);
                    break;

                case FilterNames.PRICE:
                    setPriceRangeDropDownBoxIsOpen((prev) => !prev);
                    break;

                case FilterNames.RESERVATION_DATE_PICKER:
                    setRequiredReservationDatesPickerIsOpen((prev) => !prev);
                    break;
            }
        };
    };
    const defineFilterBoxArrowClassName = (filterBoxIsOpen: boolean): string => {
        return filterBoxIsOpen ? 'filters__arrow--rotated' : 'filters__arrow--straight';
    };
    const updateQueryDataSortBy = (sortByOption: SpaceQuerySortFields): void => {
        const newQueryData: IQueryData = { ...fetchSpacesQueryData };

        newQueryData.sortBy = sortByOption;

        dispatch(setFetchSpacesQueryDataAction(newQueryData));
    };
    const updateQueryDataPriceRange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newQueryData: any = { ...fetchSpacesQueryData };
        const { value } = e.currentTarget;
        const priceRangeQueryDataReference = e.currentTarget.getAttribute('data-tag');

        newQueryData[priceRangeQueryDataReference as string] = value;

        if (value.length >= 1) {
            if (!valueIsNumeric(e.target.value)) {
                e.target.value = '';

                return;
            }

            dispatch(setFetchSpacesQueryDataAction(newQueryData));
        }
    };
    const calculateNumberOfDaysRequired = (): number => {
        const beginningDateInMs = new Date(fetchSpacesQueryData!.beginningDate!).getTime();
        const endingDateInMs = new Date(fetchSpacesQueryData!.endingDate!).getTime();

        return (endingDateInMs - beginningDateInMs) / 1000 / 60 / 60 / 24;
    };
    const formatNumberOfDaysByRussianGrammarCases = (numberOfDays: number): string => {
        if (
            numberOfDays === 1 ||
            (numberOfDays.toString()[0] !== '1' && numberOfDays.toString()[numberOfDays.toString().length - 1] === '1')
        ) {
            return `${numberOfDays} ночь`;
        } else if (
            (numberOfDays >= 2 && numberOfDays < 5) ||
            (numberOfDays.toString()[0] !== '1' &&
                ['2', '3', '4'].includes(numberOfDays.toString()[numberOfDays.toString().length - 1]))
        ) {
            return `${numberOfDays} ночи`;
        } else {
            return `${numberOfDays} ночей`;
        }
    };
    const annualizeRequiredReservationDatesRangeFilter: MouseEventHandler = (e) => {
        e.stopPropagation();

        const newQueryData = { ...fetchSpacesQueryData };

        newQueryData.beginningDate = '';
        newQueryData.endingDate = '';

        dispatch(setFetchSpacesQueryDataAction(newQueryData));
        setDatesForRender(undefined);
    };
    const renderSortByFilterDropDown = (): JSX.Element | void => {
        if (sortByDropDownBoxIsOpen) {
            const sortByDropDownOptionsRender = sortByDropDownOptions.map(
                (option: ISortByDropDownOptions, i: number) => {
                    return (
                        <div
                            className={`filters__sort-by__drop-down-menu__${option.field}`}
                            onClick={() => {
                                toggleFilterBoxIsOpen(FilterNames.SORT_BY);
                                updateQueryDataSortBy(option.field);
                            }}
                            key={i}
                        >
                            <p className={`paragraph paragraph--filters__sort-by__drop-down-menu__${option.field}`}>
                                {option.text}
                            </p>
                        </div>
                    );
                }
            );

            return <div className="filters__sort-by__drop-down-menu">{sortByDropDownOptionsRender}</div>;
        }
    };
    const renderPriceRangeInputs = (): JSX.Element | void => {
        if (priceRangeDropDownBoxIsOpen) {
            const inputs = priceRangeInputs.map((priceRangeInput: IPriceRangeInput, i: number) => {
                return (
                    <InputWithLabel
                        mainDivClassName={priceRangeInput.mainDivClassName}
                        inputClassName={priceRangeInput.inputClassName}
                        inputLabel={priceRangeInput.inputLabel}
                        inputName={priceRangeInput.inputName}
                        inputType={InputTypes.TEL}
                        onChange={updateQueryDataPriceRange}
                        dataTag={priceRangeInput.priceRangeQueryDataReference}
                        key={i}
                    />
                );
            });

            return <div className="filters__price-range__drop-down-menu drop-down-menu">{inputs}</div>;
        }
    };
    const renderRequiredReservationDatesRange = (): JSX.Element | void => {
        const requiredReservationDates = datesForRender
            ? `С ${datesForRender.beginningDate} до ${datesForRender.endingDate}`
            : 'Выберите интересующие даты...';

        return (
            <div className="dates-range">
                <p className="paragraph paragraph--light paragraph--filters__reservation-date-picker">
                    {requiredReservationDates}
                </p>
                {datesForRender ? (
                    <span ref={annualizeDatesIconRef}>
                        <FontAwesomeIcon icon={faTimes} onClick={annualizeRequiredReservationDatesRangeFilter} />
                    </span>
                ) : null}
            </div>
        );
    };
    const renderDatePicker = (): JSX.Element | void => {
        if (requiredReservationDatesPickerIsOpen) {
            return <QueryDatePicker datesForRender={datesForRender} setDatesForRender={setDatesForRender} />;
        }
    };
    const renderNumberOfDaysRequired = (): JSX.Element | void => {
        if (datesForRender) {
            const numberOfDays = calculateNumberOfDaysRequired();

            return (
                <div className="date-picker__number-of-days-required">
                    {formatNumberOfDaysByRussianGrammarCases(numberOfDays)}
                </div>
            );
        }
    };

    return (
        <section className="filters-section">
            <div className="filter filters__sort-by">
                <h3 className="heading heading--tertiary" onClick={toggleFilterBoxIsOpen(FilterNames.SORT_BY)}>
                    Сортировка<span className={defineFilterBoxArrowClassName(sortByDropDownBoxIsOpen)}>^</span>
                </h3>
                {renderSortByFilterDropDown()}
            </div>
            <div className="filter filters__price-range">
                <h3 className="heading heading--tertiary" onClick={toggleFilterBoxIsOpen(FilterNames.PRICE)}>
                    Цена<span className={defineFilterBoxArrowClassName(priceRangeDropDownBoxIsOpen)}>^</span>
                </h3>
                {renderPriceRangeInputs()}
            </div>
            <div className="filter filters__required-reservation-dates-picker">
                <div
                    className="filters__required-reservation-dates-picker__content"
                    onClick={toggleFilterBoxIsOpen(FilterNames.RESERVATION_DATE_PICKER)}
                >
                    {renderRequiredReservationDatesRange()}
                    <div className="filters__required-reservation-dates-picker__calendar">
                        <FontAwesomeIcon icon={faCalendar} />
                    </div>
                </div>
                {renderDatePicker()}
                {renderNumberOfDaysRequired()}
            </div>
        </section>
    );
}
