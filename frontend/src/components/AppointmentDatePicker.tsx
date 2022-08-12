import { ReactNode, RefObject, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DecreaseArrow from '../icons/DecreaseArrow';
import IncreaseArrow from '../icons/IncreaseArrow';
import NextIcon from '../icons/NextIcon';
import { setDatePickerDateAction } from '../redux/actions/commonActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { monthStrings } from '../types/constants';

interface IDatePickerDate {
    year: number;
    month: number;
}
interface ICurrentDate extends IDatePickerDate {
    day: number;
}
interface IDatePickerProps {
    handlePickDate: (...props: any) => any;
    componentClassNames?: string;
    innerRef?: RefObject<HTMLDivElement>;
    children?: JSX.Element | null;
    presentMonthDaysClassNamesCombined?: (day: number) => string;
}

export default function AppointmentDatePicker(props: IDatePickerProps): JSX.Element {
    const [dateIsPicked, setDateIsPicked] = useState(false);
    const { datePickerDate } = useSelector((state: IReduxState) => state.commonStorage);
    const renderNextStepsIcon = (): JSX.Element | null => {
        if (dateIsPicked) {
            return <NextIcon handleClick={() => {}} />;
        }

        return null;
    };

    const { handlePickDate, componentClassNames, innerRef, children } = props;
    const { presentMonthDaysClassNamesCombined } = props;
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
    const [monthsWithYearsDropDownMenuIsOpen, setMonthsWithYearsDropDownMenuIsOpen] = useState(false);
    const [outOfCurrentMonthDayPicked, setOutOfCurrentMonthDayPicked] = useState<number | undefined>();
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
    const switchToCorrespondingMonthThroughOutOfCurrentMonthClickEffect = (): void => {
        if (outOfCurrentMonthDayPicked) {
            handlePickDate(outOfCurrentMonthDayPicked);
            setOutOfCurrentMonthDayPicked(undefined);
        }
    };
    const updateDatePickerData = (): void => {
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

        // не дальше чем amountOfMonthsAvailable с сегодняшнего дня ]
        if (
            datePickerDate.month - currentDate.month + (datePickerDate.year - currentDate.year) * 12 <
            amountOfMonthsAvailableToLookUp
        ) {
            if (datePickerDate.month < 11) {
                newDatePickerDate.month++;
            } else {
                newDatePickerDate.month = 0;
                newDatePickerDate.year++;
            }
        }

        dispatch(setDatePickerDateAction(newDatePickerDate));
    };
    const handleAfterCurrentMonthDaysClick = (day: number): (() => void) => {
        return () => {
            increaseDatePickerMonth();
            setOutOfCurrentMonthDayPicked(day);
        };
    };
    const handleBeforeCurrentMonthDaysClick = (day: number): (() => void) => {
        return () => {
            decreaseDatePickerMonth();
            setOutOfCurrentMonthDayPicked(day);
        };
    };

    const defineTodayClassName = (day: number): string => {
        if (
            datePickerDate.month === currentDate.month &&
            datePickerDate.year === currentDate.year &&
            day === currentDate.day
        ) {
            return 'table-cell table-cell--today';
        }

        return '';
    };
    const defineCurrentMonthPastDaysClassName = (day: number): string => {
        if (datePickerDate.month === currentDate.month && day < currentDate.day) {
            return 'table-cell table-cell--past';
        }

        return '';
    };
    const defineArrowIsInactiveClassName = (): string => {
        if (
            datePickerDate.month - currentDate.month + (datePickerDate.year - currentDate.year) * 12 ===
            amountOfMonthsAvailableToLookUp
        ) {
            return 'arrow--inactive';
        }

        return '';
    };
    const renderDayCells = (): JSX.Element[] => {
        let tableRows = [];

        for (let i = 1; i <= 6; i++) {
            let tableCells = [];

            for (let j = 1; j <= 7; j++) {
                const dayCorrespondingToCalendar = (i - 1) * 7 + j - (datePickerData.weekDayStartsFrom - 1);

                if (i === 1 && j <= datePickerData.weekDayStartsFrom - 1) {
                    const day = datePickerData.lastDayOfPreviousMonth - (datePickerData.weekDayStartsFrom - 1) + j;

                    tableCells.push(
                        <td
                            className={`table-cell table-cell--out-of-month table-cell--${j} `}
                            onClick={handleBeforeCurrentMonthDaysClick(day)}
                            key={i * j}
                        >
                            {day}
                        </td>
                    );
                } else if (dayCorrespondingToCalendar > datePickerData.lastDayOfCurrentMonth) {
                    const day = dayCorrespondingToCalendar - datePickerData.lastDayOfCurrentMonth;

                    tableCells.push(
                        <td
                            className={`table-cell table-cell--out-of-month table-cell--${j} `}
                            onClick={handleAfterCurrentMonthDaysClick(day)}
                            key={i * j}
                        >
                            {day}
                        </td>
                    );
                } else {
                    tableCells.push(
                        <td
                            className={`table-cell table-cell--${j} ${defineTodayClassName(
                                dayCorrespondingToCalendar
                            )} ${defineCurrentMonthPastDaysClassName(dayCorrespondingToCalendar)} ${
                                presentMonthDaysClassNamesCombined
                                    ? presentMonthDaysClassNamesCombined!(dayCorrespondingToCalendar)
                                    : ''
                            }`}
                            onClick={() => {
                                handlePickDate(dayCorrespondingToCalendar);
                            }}
                            key={i * j}
                        >
                            {dayCorrespondingToCalendar}
                        </td>
                    );
                }
            }

            tableRows.push(
                <tr className={`table-row table-row--${i}`} key={i}>
                    {tableCells}
                </tr>
            );
        }

        return tableRows;
    };
    const renderMonthsWithYearsDropDownMenu = (): JSX.Element | void => {
        if (monthsWithYearsDropDownMenuIsOpen) {
            const monthsWithYearsDropDownOptions: JSX.Element[] = new Array(amountOfMonthsAvailableToLookUp);
            const datesCounter: ICurrentDate = { ...currentDate };
            const defineCurrentMonthClassName = (counterMonth: number): string => {
                return counterMonth === datePickerDate.month ? 'active-month' : '';
            };

            for (let i = 0; i < amountOfMonthsAvailableToLookUp; i++) {
                if (datesCounter.month <= 11) {
                    monthsWithYearsDropDownOptions.push(
                        <div
                            className={`change-date change-date--${i} ${defineCurrentMonthClassName(
                                datesCounter.month
                            )}`}
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
                            className={`${defineCurrentMonthClassName(datesCounter.month)}`}
                            onClick={updateDatePickerDateFromDropDownMenu(datesCounter.month, datesCounter.year)}
                            key={i}
                        >
                            {monthStrings[datesCounter.month]}, {datesCounter.year}
                        </div>
                    );

                    datesCounter.month++;
                }
            }

            return <div className="dropdown choose-year-dropdown">{monthsWithYearsDropDownOptions}</div>;
        }
    };
    const renderDatePickerControlPanel = (): JSX.Element => {
        return (
            <div className="date-picker__control">
                <DecreaseArrow handleClick={decreaseDatePickerMonth} />
                <div className="picked-month" onClick={toggleMonthsWithYearsDropDownMenu}>
                    {monthStrings[datePickerDate.month]}, {datePickerDate.year}
                </div>
                {renderMonthsWithYearsDropDownMenu() as ReactNode}
                <IncreaseArrow
                    combinedClassNames={defineArrowIsInactiveClassName()}
                    handleClick={increaseDatePickerMonth}
                />
            </div>
        );
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(updateDatePickerData, [datePickerDate]);
    useEffect(switchToCorrespondingMonthThroughOutOfCurrentMonthClickEffect, [
        datePickerDate,
        handlePickDate,
        outOfCurrentMonthDayPicked,
    ]);

    return (
        <div
            className={`${componentClassNames} date-picker`}
            onClick={(e) => e.stopPropagation()}
            ref={innerRef ?? undefined}
        >
            {renderDatePickerControlPanel()}
            <table className="date-picker__table">
                <tbody>
                    <tr className="weekdays">
                        <th className="weekday weekday--monday">Пн</th>
                        <th className="weekday weekday--tuesday">Вт</th>
                        <th className="weekday weekday--wednessday">Ср</th>
                        <th className="weekday weekday--thursday">Чт</th>
                        <th className="weekday weekday--friday">Пт</th>
                        <th className="weekday weekday--saturday">Сб</th>
                        <th className="weekday weekday--sunday">Вс</th>
                    </tr>
                    {renderDayCells()}
                </tbody>
            </table>
            {children}
        </div>
    );
}
