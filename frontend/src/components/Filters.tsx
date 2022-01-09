import { ChangeEventHandler, MouseEventHandler, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faTimes } from '@fortawesome/free-solid-svg-icons';
import DatePicker from './DatePicker';
import InputWithLabel, { IInputWithLableProps, InputTypes } from './InputWithLabel';
import { formatSingleDigitUnitToTwoDigitString } from '../utils/utilFunctions';
import { useSelector } from 'react-redux';
import { IReduxState } from '../redux/reducers/rootReducer';

interface IFilterRange<T> {
    from: T;
    to: T;
}
interface ISortByDropDownOptions {
    field: SpaceQuerySortFields;
    text: string;
}
interface IPriceRangeInput extends IInputWithLableProps {}
export interface IDatesRange {
    beginningDate?: string;
    endingDate?: string;
}
export interface IQueryString extends IDatesRange {
    page?: string | number;
    limit?: string | number;
    sortBy?: SpaceQuerySortFields;
    priceRange?: IFilterRange<number>;
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

export default function Filters(): JSX.Element {
    const [queryString, setQueryString] = useState<IQueryString>({
        sortBy: SpaceQuerySortFields.NEWEST,
        cityId: localStorage.getItem('currentCityId') || '',
    });
    const [datesForRender, setDatesForRender] = useState<IDatesRange>();
    const [sortByDropDownBoxIsOpen, setSortByDropDownBoxIsOpen] = useState(false);
    const [priceRangeDropDownBoxIsOpen, setPriceRangeDropDownBoxIsOpen] = useState(false);
    const [requiredReservationDatesPickerIsOpen, setRequiredReservationDatesPickerIsOpen] = useState(false);
    const [sortByDropDownOptions, setSortByDropDownOptions] = useState<ISortByDropDownOptions[]>([
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
    ]);
    const [numberOfDaysRequired, setNumberOfDaysRequired] = useState(0);
    const annualizeDatesIconRef = useRef<HTMLSpanElement>(null);
    const { datePickerDate } = useSelector((state: IReduxState) => state.commonStorage);
    const priceRangeInputs: IPriceRangeInput[] = [
        {
            inputLabel: 'От',
            mainDivClassName: 'price-range',
            inputClassName: 'price-range-from',
            inputName: 'from',
        },
        {
            inputLabel: 'До',
            mainDivClassName: 'price-range',
            inputClassName: 'price-range-to',
            inputName: 'to',
        },
    ];
    const toggleFilterBoxIsOpen = (filter: FilterNames): MouseEventHandler => {
        return (e): void => {
            console.log(e.currentTarget);

            if (e.currentTarget) {
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
            }
        };
    };
    const updateQueryStringRange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { value: payload } = e.currentTarget;
        const newQueryString: any = { ...queryString };
        newQueryString[e.currentTarget.name] = payload;

        setQueryString(newQueryString);
    };
    const generateQueryDateString = (year: number, month: number, day: number): string => {
        return `${year}-${formatSingleDigitUnitToTwoDigitString(month + 1)}-${formatSingleDigitUnitToTwoDigitString(
            day
        )}`;
    };
    const generateRenderDateString = (year: number, month: number, day: number): string => {
        return `${formatSingleDigitUnitToTwoDigitString(day)}/${formatSingleDigitUnitToTwoDigitString(
            month + 1
        )}/${year}`;
    };
    const firstDateGreaterThanSecond = (d1: string, d2: string): boolean => {
        return new Date(d1) > new Date(d2);
    };
    const pickDate = (day: number) => {
        const newQueryString: IQueryString = { ...queryString };
        const newDatesForRender: IDatesRange = { ...datesForRender };
        const pickedDate = generateQueryDateString(datePickerDate.year, datePickerDate.month, day);
        const pickedDateForRender = generateRenderDateString(datePickerDate.year, datePickerDate.month, day);

        if (newQueryString.beginningDate && newQueryString.endingDate) {
            // if you click on chosen one
            if (newQueryString.beginningDate === pickedDate || newQueryString.endingDate === pickedDate) {
                newQueryString.beginningDate = pickedDate;
                newQueryString.endingDate = generateQueryDateString(datePickerDate.year, datePickerDate.month, day + 1);
                newDatesForRender.beginningDate = pickedDateForRender;
                newDatesForRender.endingDate = generateRenderDateString(
                    datePickerDate.year,
                    datePickerDate.month,
                    day + 1
                );
            }
            // if you first click on high value then on lower value
            else if (firstDateGreaterThanSecond(newQueryString.beginningDate, pickedDate)) {
                newQueryString.endingDate = newQueryString.beginningDate;
                newQueryString.beginningDate = pickedDate;
                newDatesForRender.endingDate = newDatesForRender.beginningDate;
                newDatesForRender.beginningDate = pickedDateForRender;
            } else {
                newQueryString.endingDate = pickedDate;
                newDatesForRender.endingDate = pickedDateForRender;
            }
        } else {
            newQueryString.beginningDate = pickedDate;
            newQueryString.endingDate = generateQueryDateString(datePickerDate.year, datePickerDate.month, day + 1);
            newDatesForRender.beginningDate = pickedDateForRender;
            newDatesForRender.endingDate = generateRenderDateString(datePickerDate.year, datePickerDate.month, day + 1);
        }

        setQueryString(newQueryString);
        setDatesForRender({ beginningDate: newDatesForRender.beginningDate, endingDate: newDatesForRender.endingDate });
    };
    console.log(datesForRender);

    const defineFilterBoxArrowClassName = (filterBoxIsOpen: boolean): string => {
        return filterBoxIsOpen ? 'filters__arrow--rotated' : 'filters__arrow--straight';
    };
    const calculateNumberOfDaysRequired = (): number => {
        const beginningDateInMs = new Date(queryString.beginningDate!).getTime();
        const endingDateInMs = new Date(queryString.endingDate!).getTime();

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

        const newQueryString = { ...queryString };

        newQueryString.beginningDate = '';
        newQueryString.endingDate = '';

        setQueryString(newQueryString);
        setDatesForRender(undefined);
    };
    const renderSortByFilterDropDown = (): JSX.Element | void => {
        if (sortByDropDownBoxIsOpen) {
            const sortByDropDownOptionsRender = sortByDropDownOptions.map(
                (option: ISortByDropDownOptions, i: number) => {
                    return (
                        <div
                            className={`filters__sort-by__drop-down-menu__${option.field}`}
                            onClick={toggleFilterBoxIsOpen(FilterNames.SORT_BY)}
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
    const renderPriceRangeInputs = (): JSX.Element[] | void => {
        if (priceRangeDropDownBoxIsOpen) {
            return priceRangeInputs.map((priceRangeInput: IPriceRangeInput, i: number) => {
                return (
                    <InputWithLabel
                        mainDivClassName={priceRangeInput.mainDivClassName}
                        inputClassName={priceRangeInput.inputClassName}
                        inputLabel={priceRangeInput.inputLabel}
                        inputName={priceRangeInput.inputName}
                        inputType={InputTypes.TEL}
                        onChange={updateQueryStringRange}
                        key={i}
                    />
                );
            });
        }
    };
    const renderRequiredReservationDatesRange = (): JSX.Element | void => {
        const requiredReservationDates = datesForRender
            ? `С ${datesForRender.beginningDate} до ${datesForRender.endingDate}`
            : 'Выберите интересующие даты...';

        return (
            <div>
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
            return <DatePicker handlePickDate={pickDate} />;
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
        <section className="filters-section" style={{ display: 'flex', flexDirection: 'row' }}>
            <div className="filters__sort-by">
                <h3 className="heading heading--tertiary" onClick={toggleFilterBoxIsOpen(FilterNames.SORT_BY)}>
                    Сортировка<span className={defineFilterBoxArrowClassName(sortByDropDownBoxIsOpen)}>^</span>
                </h3>
                {renderSortByFilterDropDown()}
            </div>
            <div className="filters__price-range">
                <h3 className="heading heading--tertiary" onClick={toggleFilterBoxIsOpen(FilterNames.PRICE)}>
                    Цена<span className={defineFilterBoxArrowClassName(priceRangeDropDownBoxIsOpen)}>^</span>
                </h3>
                {renderPriceRangeInputs()}
            </div>
            <div className="filters__required-reservation-dates-picker">
                <div
                    className="filters__required-reservation-dates-picker__content--"
                    onClick={toggleFilterBoxIsOpen(FilterNames.RESERVATION_DATE_PICKER)}
                >
                    {/*  в renderRequiredReservationDatesRange есть иконка которая стирает datesForRender и queryString. Но при нажатии на нее проиходит также тоггл календаря, т.к. иконка является дочкой текущего дива */}
                    {renderRequiredReservationDatesRange()}
                    <FontAwesomeIcon icon={faCalendar} />
                </div>
                {renderDatePicker()}
                {renderNumberOfDaysRequired()}
            </div>
        </section>
    );
}
