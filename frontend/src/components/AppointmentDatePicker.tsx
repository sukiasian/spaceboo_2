import { ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DecreaseArrow from '../icons/DecreaseArrow';
import IncreaseArrow from '../icons/IncreaseArrow';
import NextIcon from '../icons/NextIcon';
import { fetchAppointmentsForMonthAction } from '../redux/actions/appointmentActions';
import { setDatePickerDateAction } from '../redux/actions/commonActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { monthStrings } from '../types/constants';
import { createDateRangeWithTimestamp, formatSingleDigitUnitToTwoDigitString } from '../utils/utilFunctions';
import { IDatesRange } from './Filters';

interface IDatePickerDate {
    year: number;
    month: number;
}
interface ICurrentDate extends IDatePickerDate {
    day: number;
}
interface IDatePickerProps {
    datesForRender: IDatesRange | undefined;
    setDatesForRender: React.Dispatch<React.SetStateAction<IDatesRange | undefined>>;
    innerRef?: RefObject<HTMLDivElement>;
    componentClassNames?: string;
    children?: JSX.Element | null;
    presentMonthDaysClassNamesCombined?: (day: number) => string;
}

interface IAppointmentParsed {
    beginningDateWithTimestamp: string;
    endingDateWithTimestamp: string;
}

interface IAppointmentsParsedAndOrganized {
    [key: string]: IAppointmentParsed[];
}

export default function AppointmentDatePicker(props: IDatePickerProps): JSX.Element {
    // NOTE probably we dont need datesForRender since we do not render anything
    const { componentClassNames, innerRef, children, datesForRender, setDatesForRender } = props;
    const { presentMonthDaysClassNamesCombined } = props;
    const [datesForAppointment, setDatesForAppointment] = useState<IDatesRange>();
    const [dateIsPicked, setDateIsPicked] = useState(false);
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
    const [parsedAppointmentsList, setParsedAppointmentsList] = useState<IAppointmentsParsedAndOrganized>({});
    const { datePickerDate } = useSelector((state: IReduxState) => state.commonStorage);
    const { fetchAppointmentsForMonthSuccessResponse } = useSelector((state: IReduxState) => state.appointmentStorage);
    const dispatch = useDispatch();
    const { spaceId } = useParams();
    const appointments = fetchAppointmentsForMonthSuccessResponse?.data;
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
    const createPropertyForParsedAppointmentsByYearAndMonth = (): string => {
        return `${datePickerDate.year}, ${datePickerDate.month}`;
    };
    const parseAppointments = (): void => {
        if (appointments) {
            appointments.forEach((appointment: string) => {
                const dates = appointment.split(',');
                const beginningDateWithTimestamp = dates[0].slice(1);
                const endingDateWithTimestamp = dates[1].slice(1, dates[1].length - 1);

                const newParsedAppointmentsList: IAppointmentsParsedAndOrganized = { ...parsedAppointmentsList };

                newParsedAppointmentsList[createPropertyForParsedAppointmentsByYearAndMonth()] = [
                    ...newParsedAppointmentsList[createPropertyForParsedAppointmentsByYearAndMonth()],
                    {
                        beginningDateWithTimestamp: beginningDateWithTimestamp,
                        endingDateWithTimestamp: endingDateWithTimestamp,
                    },
                ];

                setParsedAppointmentsList(newParsedAppointmentsList);
            });
        }
    };
    const requestAppointmentsOnMonthChange = (): void => {
        if (datePickerDate.year !== 0 && datePickerData.lastDayOfCurrentMonth > 0) {
            const requiredDates = createDateRangeWithTimestamp(
                datePickerDate.year,
                datePickerDate.month,
                datePickerData.lastDayOfCurrentMonth
            );

            dispatch(fetchAppointmentsForMonthAction({ spaceId: spaceId!, requiredDates }));
        }
    };
    const dayIsAppointed = (day: number): boolean | void => {
        const appointmentsForMonth = parsedAppointmentsList?.[createPropertyForParsedAppointmentsByYearAndMonth()];

        if (appointmentsForMonth) {
            for (const monthAppointments of appointmentsForMonth) {
                const beginningDate = new Date(monthAppointments.beginningDateWithTimestamp);
                const endingDate = new Date(monthAppointments.endingDateWithTimestamp);

                if (day >= beginningDate.getUTCDate() || day < endingDate.getUTCDate()) {
                    return true;
                }
            }
        }

        return false;
    };
    const defineAppointedDayClassName = (day: number): string => {
        if (!dayIsInThePast(day)) {
            return dayIsAppointed(day) ? 'table-cell--appointed' : 'table-cell--available';
        }

        return '';
    };
    const switchToCorrespondingMonthThroughOutOfCurrentMonthClickEffect = (): void => {
        if (outOfCurrentMonthDayPicked) {
            pickDate(outOfCurrentMonthDayPicked);
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
    const generateAppointmentDateString = (year: number, month: number, day: number, isEnding = false): string => {
        const dateFromArgs = new Date(year, month + 1, 0);

        if (isEnding && day === dateFromArgs.getDate() + 1 && month !== 11) {
            return `${year}-${formatSingleDigitUnitToTwoDigitString(month + 2)}-${formatSingleDigitUnitToTwoDigitString(
                1
            )}`;
        } else if (isEnding && day === dateFromArgs.getDate() + 1 && month === 11) {
            return `${year + 1}-${formatSingleDigitUnitToTwoDigitString(1)}-${formatSingleDigitUnitToTwoDigitString(
                1
            )}`;
        }

        return `${year}-${formatSingleDigitUnitToTwoDigitString(month + 1)}-${formatSingleDigitUnitToTwoDigitString(
            day
        )}`;
    };
    const generateRenderDateString = (year: number, month: number, day: number, isEnding = false): string => {
        const dateFromArgs = new Date(year, month + 1, 0);

        if (isEnding && day === dateFromArgs.getDate() + 1 && month !== 11) {
            return `${formatSingleDigitUnitToTwoDigitString(1)}/${formatSingleDigitUnitToTwoDigitString(
                month + 2
            )}/${year}`;
        } else if (isEnding && day === dateFromArgs.getDate() + 1 && month === 11) {
            return `${formatSingleDigitUnitToTwoDigitString(1)}/${formatSingleDigitUnitToTwoDigitString(1)}/${
                year + 1
            }`;
        }

        return `${formatSingleDigitUnitToTwoDigitString(day)}/${formatSingleDigitUnitToTwoDigitString(
            month + 1
        )}/${year}`;
    };
    const firstDateIsGreaterThanSecond = (d1: string, d2: string): boolean => {
        return new Date(d1) > new Date(d2);
    };
    const pickDate = (day: number) => {
        const newDatesForQuery: IDatesRange = { ...datesForAppointment };
        const newDatesForRender: IDatesRange = { ...datesForRender };
        const pickedDate = generateAppointmentDateString(datePickerDate.year, datePickerDate.month, day);

        //  if a day is in the past
        if (dayIsInThePast(day)) {
            return;
        } else {
            if (newDatesForQuery.beginningDate && newDatesForQuery.endingDate) {
                // if you click on chosen one
                if (newDatesForQuery.beginningDate === pickedDate || newDatesForQuery.endingDate === pickedDate) {
                    newDatesForQuery.beginningDate = pickedDate;
                    newDatesForQuery.endingDate = generateAppointmentDateString(
                        datePickerDate.year,
                        datePickerDate.month,
                        day + 1,
                        true
                    );
                }
                // if you first click on high value then on lower value
                else if (firstDateIsGreaterThanSecond(newDatesForQuery.beginningDate, pickedDate)) {
                    newDatesForQuery.endingDate = newDatesForQuery.beginningDate;
                    newDatesForQuery.beginningDate = pickedDate;
                } else {
                    newDatesForQuery.endingDate = pickedDate;
                }
            } else {
                newDatesForQuery.beginningDate = pickedDate;
                newDatesForQuery.endingDate = generateAppointmentDateString(
                    datePickerDate.year,
                    datePickerDate.month,
                    day + 1,
                    true
                );
            }
        }

        setDatesForAppointment(newDatesForQuery);

        setDatesForRender({
            beginningDate: newDatesForRender.beginningDate,
            endingDate: newDatesForRender.endingDate,
        });
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
            if (!datesForAppointment?.beginningDate) {
                increaseDatePickerMonth();
                setOutOfCurrentMonthDayPicked(day);
            }
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
    const definePickedDaysClassName = (day: number): string => {
        if (datesForAppointment?.beginningDate && datesForAppointment?.endingDate) {
            const dateForCurrentDay = new Date(
                generateAppointmentDateString(datePickerDate.year, datePickerDate.month, day)
            );
            const beginningDate = new Date(datesForAppointment.beginningDate as string);
            const endingDate = new Date(datesForAppointment.endingDate as string);

            if (dateForCurrentDay >= beginningDate && beginningDate >= dateForCurrentDay) {
                return 'picked-day table-cell--at-border--left';
            } else if (dateForCurrentDay >= endingDate && endingDate >= dateForCurrentDay) {
                return 'picked-day table-cell--at-border--right';
            } else if (dateForCurrentDay > beginningDate && dateForCurrentDay < endingDate) {
                return 'picked-day table-cell--picked';
            }
        }

        return '';
    };
    const defineUnclickableDaysForUpcomingMonthClassName = (): string => {
        return datesForAppointment?.beginningDate ? 'table-cell--unclickable' : '';
    };
    const dayIsInThePast = (day: number): boolean => {
        return datePickerDate.month === currentDate.month && day < currentDate.day;
    };
    const defineCurrentMonthPastDaysClassName = (day: number): string => {
        if (dayIsInThePast(day)) {
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
                            className={`table-cell table-cell--out-of-month table-cell--${j} ${defineUnclickableDaysForUpcomingMonthClassName()}`}
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
                            )} ${defineCurrentMonthPastDaysClassName(
                                dayCorrespondingToCalendar
                            )} ${definePickedDaysClassName(dayCorrespondingToCalendar)} ${defineAppointedDayClassName(
                                dayCorrespondingToCalendar
                            )}  ${
                                presentMonthDaysClassNamesCombined
                                    ? presentMonthDaysClassNamesCombined!(dayCorrespondingToCalendar)
                                    : ''
                            }`}
                            onClick={() => {
                                // const date = new Date(
                                //     generateAppointmentDateString(
                                //         datePickerDate.year,
                                //         datePickerDate.month,
                                //         dayCorrespondingToCalendar
                                //     )
                                // );
                                // parsedAppointmentsList.current.forEach((appointment: IAppointmentParsed) => {
                                //     if (
                                //         date >= new Date(appointment.beginningDateWithTimestamp) &&
                                //         date < new Date(appointment.endingDateWithTimestamp)
                                //     ) {
                                //         return;
                                //     }
                                // });
                                // pickDate(dayCorrespondingToCalendar);
                            }}
                            onMouseEnter={(e) => {
                                if (datesForAppointment?.beginningDate) {
                                    const dateForCurrentDay = new Date(
                                        generateAppointmentDateString(
                                            datePickerDate.year,
                                            datePickerDate.month,
                                            dayCorrespondingToCalendar
                                        )
                                    );
                                    const beginningDate = new Date(datesForAppointment.beginningDate as string);
                                    

                                    // встает проблема как быть с parsedAppointments - они
                                    // меняются при каждом изменении месяца.
                                    // Подтягивать каждый раз новые?
                                }
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
    const renderNextStepsIcon = (): JSX.Element | null => {
        if (dateIsPicked) {
            return <NextIcon handleClick={() => {}} />;
        }

        return null;
    };

    useEffect(applyEffectsOnInit, []);
    useEffect(updateDatePickerData, [datePickerDate]);
    useEffect(switchToCorrespondingMonthThroughOutOfCurrentMonthClickEffect, [
        datePickerDate,
        outOfCurrentMonthDayPicked,
    ]);
    useEffect(requestAppointmentsOnMonthChange, [datePickerDate, datePickerData]);
    useEffect(parseAppointments, [fetchAppointmentsForMonthSuccessResponse]);
    useEffect(() => {}, [appointments]);

    /*  
    
    Как проверять при наведении?

    То есть как только выбрана первая дата, при наведении мы должны пройтись по всем датам от начала 
    до наведенной даты и проверить входят ли они в parsedAppointments или нет.

    

    
    
    */

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
                    {renderNextStepsIcon()}
                </tbody>
            </table>
            {children}
        </div>
    );
}
