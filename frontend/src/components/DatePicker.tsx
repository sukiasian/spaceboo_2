import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { monthStrings } from '../types/constants';
import { useDispatch, useSelector } from 'react-redux';
import { setDatePickerDateAction } from '../redux/actions/commonActions';
import { IReduxState } from '../redux/reducers/rootReducer';

interface IDatePickerDate {
    year: number;
    month: number;
}
interface ICurrentDate extends IDatePickerDate {
    day: number;
}
interface IDatePickerProps {
    handlePickDate: (...props: any) => any;
}

export default function DatePicker(props: IDatePickerProps): JSX.Element {
    const { handlePickDate } = props;
    const [currentDate, setCurrentDate] = useState<ICurrentDate>({
        year: 0,
        month: 0,
        day: 0,
    });
    const [datePickerData, setDatePickerData] = useState({
        weekDayStartsFrom: 0,
        lastDayOfCurrentMonth: 0,
        lastDayOfPreviousMonth: 0,
    });
    const { datePickerDate } = useSelector((state: IReduxState) => state.commonStorage);
    const [monthsWithYearsDropDownMenuIsOpen, setMonthsWithYearsDropDownMenuIsOpen] = useState(false);
    const dispatch = useDispatch();
    const amountOfMonthsAvailableToLookUp = 12;
    const getDatePickerDateFromTodayDate = (date: Date): IDatePickerDate => {
        const year = date.getFullYear();
        const month = date.getMonth();

        return {
            year,
            month,
        };
    };
    const defineCurrentDateAndPickOnInit = (): void => {
        const now = new Date();
        const newDatePickerDate = getDatePickerDateFromTodayDate(now);

        dispatch(setDatePickerDateAction(newDatePickerDate));

        const newCurrentDate: ICurrentDate = { ...newDatePickerDate, day: now.getDate() };

        setCurrentDate(newCurrentDate);
    };
    const applyEffectsOnInit = (): void => {
        defineCurrentDateAndPickOnInit();
    };
    const updateDatePickerDate = (): void => {
        if (datePickerDate.year !== 0) {
            const date = new Date(datePickerDate.year, datePickerDate.month, 1);
            const year = date.getFullYear();
            const month = date.getMonth();

            setDatePickerData({
                weekDayStartsFrom: date.getDay() === 0 ? 7 : new Date(date.getFullYear(), date.getMonth(), 1).getDay(),
                lastDayOfCurrentMonth: new Date(year, month + 1, 0).getDate(),
                lastDayOfPreviousMonth: new Date(year, month, 0).getDate(),
            });
        }
    };
    const toggleMonthsWithYearsDropDownMenu = (): void => {
        setMonthsWithYearsDropDownMenuIsOpen((prev) => !prev);
    };
    const updateDatePickerDateFromDropDownMenu = (month: number, year = currentDate.year): (() => void) => {
        return (): void => {
            const dateOfMonthBeginning = new Date(year, month, 1);
            const date = getDatePickerDateFromTodayDate(dateOfMonthBeginning);

            dispatch(setDatePickerDateAction(date));
            setMonthsWithYearsDropDownMenuIsOpen(false);
        };
    };

    const decreaseDatePickerMonth = (): void => {
        const newDatePickerDate: IDatePickerDate = { ...datePickerDate };

        if (datePickerDate.month !== currentDate.month || datePickerDate.year !== currentDate.year) {
            if (datePickerDate.month > 0) {
                newDatePickerDate.month--;
            } else {
                newDatePickerDate.month = 11;
                newDatePickerDate.year--;
            }
        }

        dispatch(setDatePickerDateAction(newDatePickerDate));
    };
    const increaseDatePickerMonth = (): void => {
        const newDatePickerDate: IDatePickerDate = { ...datePickerDate };

        if (datePickerDate.month + (datePickerDate.year - currentDate.year) * 12 < amountOfMonthsAvailableToLookUp) {
            if (datePickerDate.month < 11) {
                newDatePickerDate.month++;
            } else {
                newDatePickerDate.month = 0;
                newDatePickerDate.year++;
            }
        }

        dispatch(setDatePickerDateAction(newDatePickerDate));
    };
    const handleOutOfCalendarDaysClick = (day: number) => {
        increaseDatePickerMonth();
        // change beginningDate
    };

    // FIXME TODO это должна быть функция переданная извне - чтобы компонент был реюзабл.

    const defineActiveDayClassName = (day: number): string => {
        if (
            datePickerDate.month === currentDate.month &&
            datePickerDate.year === currentDate.year &&
            day === currentDate.day
        ) {
            return 'date-picker__table__cell--active';
        }

        return '';
    };
    const definePastDaysClassName = (day: number): string => {
        if (datePickerDate.month === currentDate.month && day < currentDate.day) {
            return 'date-picker__table__cell--past';
        }

        return '';
    };
    const renderDayCells = (): JSX.Element[] => {
        let tableRows = [];

        for (let i = 1; i <= 6; i++) {
            let tableCells = [];

            for (let j = 1; j <= 7; j++) {
                const dayInCalendar = (i - 1) * 7 + j - (datePickerData.weekDayStartsFrom - 1);

                if (i === 1 && j <= datePickerData.weekDayStartsFrom - 1) {
                    tableCells.push(
                        <td
                            className={`date-picker__table__cell date-picker__table__cell--out-of-month date-picker__table__cell--${j}`}
                            key={i * j}
                        >
                            {datePickerData.lastDayOfPreviousMonth - (datePickerData.weekDayStartsFrom - 1) + j}
                        </td>
                    );
                } else if (dayInCalendar > datePickerData.lastDayOfCurrentMonth) {
                    tableCells.push(
                        <td
                            className={`date-picker__table__cell date-picker__table__cell--out-of-month date-picker__table__cell--${j}`}
                            key={i * j}
                        >
                            {dayInCalendar - datePickerData.lastDayOfCurrentMonth}
                        </td>
                    );
                } else {
                    const day = (i - 1) * 7 + j - (datePickerData.weekDayStartsFrom - 1);

                    tableCells.push(
                        <td
                            className={`date-picker__table__cell date-picker__table__cell--${j} ${defineActiveDayClassName(
                                day
                            )} ${definePastDaysClassName(day)}`}
                            onClick={() => {
                                handlePickDate(day);
                            }}
                            key={i * j}
                        >
                            {day}
                        </td>
                    );
                }
            }

            tableRows.push(
                <tr className={`date-picker__table__row date-picker__table__row--${i}`} key={i}>
                    {tableCells}
                </tr>
            );
        }

        return tableRows;
    };
    const renderMonthsWithYearsDropDownMenu = (): JSX.Element[] | void => {
        if (monthsWithYearsDropDownMenuIsOpen) {
            const monthsWithYearsDropDownOptions: JSX.Element[] = new Array(amountOfMonthsAvailableToLookUp);
            const datesCounter: ICurrentDate = { ...currentDate };

            for (let i = 0; i < amountOfMonthsAvailableToLookUp; i++) {
                if (datesCounter.month <= 11) {
                    monthsWithYearsDropDownOptions.push(
                        <div
                            className=""
                            onClick={updateDatePickerDateFromDropDownMenu(datesCounter.month, datesCounter.year)}
                            key={i}
                        >
                            {monthStrings[datesCounter.month]}, {datesCounter.year}
                        </div>
                    );

                    datesCounter.month++;
                } else {
                    datesCounter.month = 0;
                    datesCounter.year++;

                    monthsWithYearsDropDownOptions.push(
                        <div
                            className=""
                            onClick={updateDatePickerDateFromDropDownMenu(datesCounter.month, datesCounter.year)}
                            key={i}
                        >
                            {monthStrings[datesCounter.month]}, {datesCounter.year}
                        </div>
                    );

                    datesCounter.month++;
                }
            }

            return monthsWithYearsDropDownOptions;
        }
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(updateDatePickerDate, [datePickerDate]);

    return (
        <div className="date-picker">
            <div className="date-picker__control">
                <FontAwesomeIcon icon={faAngleLeft} onClick={decreaseDatePickerMonth} />
                <div className="date-picker__control__picked-month" onClick={toggleMonthsWithYearsDropDownMenu}>
                    {monthStrings[datePickerDate.month]}, {datePickerDate.year}
                </div>
                {renderMonthsWithYearsDropDownMenu()}
                <FontAwesomeIcon icon={faAngleRight} onClick={increaseDatePickerMonth} />
            </div>
            <table className="date-picker__table">
                <tbody>
                    <tr>
                        <th className="date-picker__table__weekday date-picker__table__weekday--monday">Пн</th>
                        <th className="date-picker__table__weekday date-picker__table__weekday--tuesday">Вт</th>
                        <th className="date-picker__table__weekday date-picker__table__weekday--wednessday">Ср</th>
                        <th className="date-picker__table__weekday date-picker__table__weekday--thursday">Чт</th>
                        <th className="date-picker__table__weekday date-picker__table__weekday--friday">Пт</th>
                        <th className="date-picker__table__weekday date-picker__table__weekday--saturday">Сб</th>
                        <th className="date-picker__table__weekday date-picker__table__weekday--sunday">Вс</th>
                    </tr>
                    {renderDayCells()}
                </tbody>
            </table>
        </div>
    );
}
