import { ChangeEventHandler, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import DatePicker from './DatePicker';
import InputWithLabel, { IInputWithLableProps, InputTypes } from './InputWithLabel';

interface IFilterRange<T> {
    from: T;
    to: T;
}
interface ISortByDropDownOptions {
    field: SpaceQuerySortFields;
    text: string;
}
interface IPriceRangeInput extends IInputWithLableProps {}
export interface IQueryString {
    page?: string | number;
    limit?: string | number;
    sortBy?: SpaceQuerySortFields;
    priceRange?: IFilterRange<number>;
    beginningDate?: string;
    beginningTime?: string;
    endingDate?: string;
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
    const toggleFilterBoxIsOpen = (filter: FilterNames): (() => void) => {
        return (): void => {
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
    const updateQueryStringRange: ChangeEventHandler<HTMLInputElement> = (e) => {
        const { value: payload } = e.currentTarget;
        const newQueryString: any = { ...queryString };
        newQueryString[e.currentTarget.name] = payload;

        setQueryString(newQueryString);
    };
    const defineFilterBoxArrowClassName = (filterBoxIsOpen: boolean): string => {
        return filterBoxIsOpen ? 'filters__arrow--rotated' : 'filters__arrow--straight';
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
        // NOTE понять как будет работать диспатч - мы должны будем отправлять запрос только тогда когда будет определен весь рендж, а не одно значение (от либо до)
        const requiredReservationDates =
            queryString.beginningDate && queryString.endingDate
                ? `${queryString.beginningDate} ${queryString.beginningTime}, ${queryString.endingDate} ${queryString.endingTime}`
                : 'Выберите интересующие даты...';

        return (
            <p className="paragraph paragraph--light paragraph--filters__reservation-date-picker">
                {requiredReservationDates}
            </p>
        );
    };
    const renderDatePicker = (): JSX.Element | void => {
        if (requiredReservationDatesPickerIsOpen) {
            return <DatePicker queryString={queryString} setQueryString={setQueryString} />;
        }
    };

    useEffect(() => console.log(queryString), [queryString]);

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
                    className="filters__required-reservation-dates-picker__content"
                    onClick={toggleFilterBoxIsOpen(FilterNames.RESERVATION_DATE_PICKER)}
                >
                    {renderRequiredReservationDatesRange()}
                    <FontAwesomeIcon icon={faCalendar} />
                </div>
                {renderDatePicker()}
            </div>
        </section>
    );
}
