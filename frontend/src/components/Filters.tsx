import { ChangeEventHandler, MouseEventHandler, useEffect, useRef, useState } from 'react';
import InputWithLabel, { IInputWithLableProps, InputType } from './InputWithLabel';
import { useDispatch, useSelector } from 'react-redux';
import QueryDatePicker from './QueryDatePicker';
import { annualizeFetchSpacesResponsesAction, setFetchSpacesQueryDataAction } from '../redux/actions/spaceActions';
import { valueIsNumeric } from '../utils/utilFunctions';
import { IReduxState } from '../redux/reducers/rootReducer';
import RemoveIcon from '../icons/RemoveIcon';
import CalendarIcon from '../icons/CalendarIcon';

interface IPriceRange {
    priceFrom?: string;
    priceTo?: string;
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
    page?: number;
    limit?: string | number;
    offset?: number;
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
    const [sortByQueryOption, setSortByQueryOption] = useState<SpaceQuerySortFields>();
    const [priceRange, setPriceRange] = useState<IPriceRange>();
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
    const sortByRef = useRef<HTMLDivElement>(null);
    const priceRangeRef = useRef<HTMLDivElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);
    const annualizeDatesIconRef = useRef<HTMLDivElement>(null);
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
    const applyCloseSortByEvents = (): (() => void) => {
        if (sortByDropDownBoxIsOpen) {
            document.addEventListener('click', closeSortByOnOutsideClick);
        }

        return () => {
            document.removeEventListener('click', closeSortByOnOutsideClick);
        };
    };
    const applyClosePriceRangeEvents = (): (() => void) => {
        if (priceRangeDropDownBoxIsOpen) {
            document.addEventListener('click', closePriceRangeOnOutsideClick);
        }

        return () => {
            document.removeEventListener('click', closePriceRangeOnOutsideClick);
        };
    };
    const applyCloseDatePickerEvents = (): (() => void) => {
        if (requiredReservationDatesPickerIsOpen) {
            document.addEventListener('click', closeDatePickerOnOutsideClick);
        }

        return () => {
            document.removeEventListener('click', closeDatePickerOnOutsideClick);
        };
    };
    const prepareNewFetchSpacesQueryDataForApplyingSortByFilter = () => {
        if (sortByQueryOption) {
            const newQueryData: IQueryData = { ...fetchSpacesQueryData! };

            newQueryData.page = 1;
            newQueryData.sortBy = sortByQueryOption;

            dispatch(setFetchSpacesQueryDataAction(newQueryData));
        }
    };
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
        if (sortByQueryOption !== sortByOption) {
            dispatch(annualizeFetchSpacesResponsesAction());
            setSortByQueryOption(sortByOption);
        }
    };
    const updateQueryDataPriceRange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const newQueryData: any = { ...fetchSpacesQueryData };
        const { value } = e.currentTarget;
        const priceRangeQueryDataReference = e.currentTarget.getAttribute('data-tag');

        // newQueryData[priceRangeQueryDataReference as string] = value;
        const newPriceRange: IPriceRange = { ...priceRange };

        newPriceRange[priceRangeQueryDataReference as keyof IPriceRange] = value;

        if (value.length >= 1) {
            if (!valueIsNumeric(value)) {
                e.target.value = '';

                return;
            }

            // dispatch(setFetchSpacesQueryDataAction(newQueryData));
        }

        dispatch(annualizeFetchSpacesResponsesAction());
        setPriceRange(newPriceRange);
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
    const closeSortByOnOutsideClick = (e: MouseEvent): void => {
        if (sortByDropDownBoxIsOpen && e.target !== sortByRef.current) {
            setSortByDropDownBoxIsOpen(false);
        }
    };
    const closePriceRangeOnOutsideClick = (e: MouseEvent): void => {
        if (priceRangeDropDownBoxIsOpen && e.target !== priceRangeRef.current) {
            setPriceRangeDropDownBoxIsOpen(false);
        }
    };
    const closeDatePickerOnOutsideClick = (e: MouseEvent): void => {
        if (requiredReservationDatesPickerIsOpen && e.target !== datePickerRef.current) {
            setRequiredReservationDatesPickerIsOpen(false);
        }
    };
    const renderSortByFilterDropDown = (): JSX.Element | void => {
        if (sortByDropDownBoxIsOpen) {
            const sortByDropDownOptionsRender = sortByDropDownOptions.map(
                (option: ISortByDropDownOptions, i: number) => {
                    return (
                        <div
                            className={`sort-by-option--${option.field}`}
                            onClick={(e) => {
                                e.stopPropagation();
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

            return <div className="drop-down filters__sort-by__drop-down">{sortByDropDownOptionsRender}</div>;
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
                        inputType={InputType.TEL}
                        onChange={updateQueryDataPriceRange}
                        dataTag={priceRangeInput.priceRangeQueryDataReference}
                        key={i}
                    />
                );
            });

            return (
                <div className="drop-down filters__price-range__drop-down" onClick={(e) => e.stopPropagation()}>
                    {inputs}
                </div>
            );
        }
    };
    const renderPickDatesMessage = (): JSX.Element | void => {
        if (!datesForRender) {
            return (
                <div className="dates-range__message">
                    <p className={'paragraph paragraph--light pick-dates-message'}>Выберите интересующие даты...</p>
                </div>
            );
        }
    };
    const renderRequiredReservationData = (): JSX.Element | void => {
        if (datesForRender) {
            const numberOfDays = calculateNumberOfDaysRequired();

            return (
                <div className="dates-range__data">
                    <div className="paragraph-container paragraph-container-picked-dates">
                        <p className={'paragraph paragraph--light picked-dates'}>
                            С {datesForRender.beginningDate} до {datesForRender.endingDate}
                        </p>
                    </div>
                    <RemoveIcon
                        handleClick={annualizeRequiredReservationDatesRangeFilter}
                        innerRef={annualizeDatesIconRef}
                    />
                    <div className="number-of-nights-container">
                        <p className="paragraph">{formatNumberOfDaysByRussianGrammarCases(numberOfDays)}</p>
                    </div>
                </div>
            );
        }
    };
    const renderDatePicker = (): JSX.Element | void => {
        if (requiredReservationDatesPickerIsOpen) {
            return (
                <QueryDatePicker
                    datesForRender={datesForRender}
                    setDatesForRender={setDatesForRender}
                    innerRef={datePickerRef}
                />
            );
        }
    };

    useEffect(applyCloseSortByEvents, [sortByDropDownBoxIsOpen]);
    useEffect(applyClosePriceRangeEvents, [priceRangeDropDownBoxIsOpen]);
    useEffect(applyCloseDatePickerEvents, [requiredReservationDatesPickerIsOpen]);
    useEffect(prepareNewFetchSpacesQueryDataForApplyingSortByFilter, [sortByQueryOption]);
    useEffect(() => {
        if (priceRange?.priceFrom) {
            const newQueryData: IQueryData = { ...fetchSpacesQueryData! };

            newQueryData.page = 1;
            newQueryData.priceFrom = priceRange.priceFrom;

            dispatch(setFetchSpacesQueryDataAction(newQueryData));
        } else if (priceRange?.priceTo) {
            const newQueryData: IQueryData = { ...fetchSpacesQueryData! };

            newQueryData.page = 1;
            newQueryData.priceTo = priceRange.priceTo;

            dispatch(setFetchSpacesQueryDataAction(newQueryData));
        }
    }, [priceRange]);

    return (
        <section className="filters-section">
            <div
                className="filter filters__sort-by"
                onClick={toggleFilterBoxIsOpen(FilterNames.SORT_BY)}
                ref={sortByRef}
            >
                <div className="heading-container">
                    <h3 className="heading heading--tertiary">
                        Сортировка<span className={defineFilterBoxArrowClassName(sortByDropDownBoxIsOpen)}>^</span>
                    </h3>
                </div>
                {renderSortByFilterDropDown()}
            </div>
            <div
                className="filter filters__price-range"
                onClick={toggleFilterBoxIsOpen(FilterNames.PRICE)}
                ref={priceRangeRef}
            >
                <div className="heading-container">
                    <h3 className="heading heading--tertiary">
                        Цена<span className={defineFilterBoxArrowClassName(priceRangeDropDownBoxIsOpen)}>^</span>
                    </h3>
                </div>
                {renderPriceRangeInputs()}
            </div>
            <div className="filter filters__required-reservation-dates-picker">
                <div className="filters-content" onClick={toggleFilterBoxIsOpen(FilterNames.RESERVATION_DATE_PICKER)}>
                    <div className="dates-range">
                        {renderPickDatesMessage()}
                        {renderRequiredReservationData()}
                    </div>
                    <CalendarIcon />
                </div>
                {renderDatePicker()}
            </div>
        </section>
    );
}
