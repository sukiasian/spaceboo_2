import { useEffect, useState } from 'react';
import { monthStrings } from '../types/constants';
import { IQueryString } from './Filters';

interface IDatePickerDate {
    year: number;
    month: number;
}
interface ICurrentDate extends IDatePickerDate {
    day: number;
}
interface IDatePickerProps {
    queryString: IQueryString;
    setQueryString: React.Dispatch<React.SetStateAction<IQueryString>>;
}

export default function DatePicker(props: IDatePickerProps): JSX.Element {
    const { queryString, setQueryString }: IDatePickerProps = props;
    const [currentDate, setCurrentDate] = useState<ICurrentDate>({
        year: 0,
        month: 0,
        day: 0,
    });
    const [datePickerDate, setDatePickerDate] = useState<IDatePickerDate>({
        year: 0,
        month: 0,
    });
    const [datePickerData, setDatePickerData] = useState({
        weekDayStartsFrom: 0,
        lastDayOfCurrentMonth: 0,
        lastDayOfPreviousMonth: 0,
    });
    const [monthsWithYearsDropDownMenuIsOpen, setMonthsWithYearsDropDownMenuIsOpen] = useState(false);
    const amountOfMonthsAvailableToLookUp = 12;
    const getDatePickerDateFromDate = (date: Date): IDatePickerDate => {
        const year = date.getFullYear();
        const month = date.getMonth();

        return {
            year,
            month,
        };
    };
    const defineCurrentDateAndPickOnInit = (): void => {
        const now = new Date();
        const newDatePickerDate = getDatePickerDateFromDate(now);

        setDatePickerDate(newDatePickerDate);

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
            const date = getDatePickerDateFromDate(dateOfMonthBeginning);

            setDatePickerDate(date);
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

        setDatePickerDate(newDatePickerDate);
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

        setDatePickerDate(newDatePickerDate);
    };
    const pickBeginningDate = (): void => {};
    const pickEndingDate = (): void => {};
    const renderDayCells = (): JSX.Element[] => {
        let tableRows = [];

        for (let i = 1; i <= 6; i++) {
            let tableCells = [];

            for (let j = 1; j <= 7; j++) {
                const dayInCalendar = (i - 1) * 7 + j - (datePickerData.weekDayStartsFrom - 1);

                if (i === 1 && j <= datePickerData.weekDayStartsFrom - 1) {
                    tableCells.push(
                        <td className="date-table__cell--inactive prev-month-cell date-table__cell" key={i * j}>
                            {datePickerData.lastDayOfPreviousMonth - (datePickerData.weekDayStartsFrom - 1) + j}
                        </td>
                    );
                } else if (dayInCalendar > datePickerData.lastDayOfCurrentMonth) {
                    tableCells.push(
                        <td className="date-table__cell--inactive next-month-cell date-table__cell" key={i * j}>
                            {dayInCalendar - datePickerData.lastDayOfCurrentMonth}
                        </td>
                    );
                } else {
                    tableCells.push(
                        <td onClick={() => {}} key={i * j}>
                            {(i - 1) * 7 + j - (datePickerData.weekDayStartsFrom - 1)}
                        </td>
                    );
                }
            }

            tableRows.push(
                <tr className="date-table__days date-table__cells" key={i}>
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
                <div
                    className="date-picker__control__pick-month date-picker__control__pick-month--back"
                    onClick={decreaseDatePickerMonth}
                >
                    {'<'}
                </div>
                <div className="date-picker__control__picked-month" onClick={toggleMonthsWithYearsDropDownMenu}>
                    {monthStrings[datePickerDate.month]}, {datePickerDate.year}
                </div>
                {renderMonthsWithYearsDropDownMenu()}
                <div
                    className="date-picker__control__pick-month date-picker__control__pick-month--forward"
                    onClick={increaseDatePickerMonth}
                >
                    {'>'}
                </div>
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
