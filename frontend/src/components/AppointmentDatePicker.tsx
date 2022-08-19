import { MouseEventHandler, ReactNode, RefObject, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import DecreaseArrow from '../icons/DecreaseArrow';
import IncreaseArrow from '../icons/IncreaseArrow';
import { fetchAppointmentsForMonthAction, postCreateAppointmentAction } from '../redux/actions/appointmentActions';
import { setDatePickerDateAction } from '../redux/actions/commonActions';
import { ICreateAppointmentPayload } from '../redux/reducers/appointmentReducer';
import { IReduxState } from '../redux/reducers/rootReducer';
import { monthStrings } from '../types/constants';
import { createDateRangeWithTimestamp, formatSingleDigitUnitToTwoDigitString } from '../utils/utilFunctions';
import ConfirmDialog from './ConfirmDialog';
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
    const { componentClassNames, innerRef, datesForRender, setDatesForRender } = props;
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
    const [pointedDate, setPointedDate] = useState<Date>();
    const [unappointableDaysPointed, setUnappointableDaysPointed] = useState(false);
    const [confirmAppointmentIsOpen, setConfirmAppointmentIsOpen] = useState(false);

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
        return `${datePickerDate.year}, ${datePickerDate.month + 1}`;
    };

    const parseAppointments = (): void => {
        if (appointments) {
            const newParsedAppointmentsList: IAppointmentsParsedAndOrganized = {
                ...parsedAppointmentsList,
            };

            appointments.forEach((appointment: any) => {
                const { isoDatesReserved } = appointment;

                const beginningDateWithTimestamp = isoDatesReserved[0].value;
                const endingDateWithTimestamp = isoDatesReserved[1].value;

                newParsedAppointmentsList[createPropertyForParsedAppointmentsByYearAndMonth()] = [
                    ...(newParsedAppointmentsList[createPropertyForParsedAppointmentsByYearAndMonth()] || []),
                    {
                        beginningDateWithTimestamp,
                        endingDateWithTimestamp,
                    },
                ];
            });

            setParsedAppointmentsList(newParsedAppointmentsList);
        }
    };
    const requestAppointmentsOnMonthChange = (): void => {
        if (datePickerDate.year !== 0 && datePickerData.lastDayOfCurrentMonth > 0) {
            const requiredDates = createDateRangeWithTimestamp(
                datePickerDate.year,
                datePickerDate.month + 1,
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

                if (day >= beginningDate.getUTCDate() && day < endingDate.getUTCDate()) {
                    return true;
                }
            }
        }

        return false;
    };

    const defineAppointedDayClassName = (day: number): string => {
        if (!dayIsInThePast(day)) {
            return dayIsAppointed(day) ? 'table-cell--appointed' : '';
        }

        return '';
    };
    const defineUnappointableDayClassName = (day: number): string => {
        // NOTE: needed for hover (onMouseEnter event)
        const dateForCell = new Date(datePickerDate.year, datePickerDate.month, day);

        // если есть pointedDate это означает что appointable? или же в любом случае должен быть pointedDate?
        if (
            pointedDate &&
            datesForAppointment?.beginningDate &&
            dateForCell >= new Date(datesForAppointment.beginningDate) &&
            dateForCell < pointedDate
        ) {
            if (unappointableDaysPointed) {
                return 'table-cell--unappointable';
            } else {
                return 'table-cell--appointable';
            }
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
        if (dayIsInThePast(day) || dayIsAppointed(day)) {
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
    const annualizePointedDateAndUnappointableDaysPointed = (): void => {
        setPointedDate(undefined);
        setUnappointableDaysPointed(false);
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

    const toggleConfirmAppointmentDialog = (): void => {
        setConfirmAppointmentIsOpen((prev) => !prev);
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
    // NOTE: why not used?
    const defineAppointedDaysClassName = (day: number): string => {
        const date = new Date(datePickerDate.year, datePickerDate.month, day);

        if (!dayIsInThePast(day)) {
            parsedAppointmentsList[createPropertyForParsedAppointmentsByYearAndMonth()].forEach((appointmentParsed) => {
                if (
                    date >= new Date(appointmentParsed.beginningDateWithTimestamp) &&
                    date < new Date(appointmentParsed.endingDateWithTimestamp)
                ) {
                    return 'table-cell--appointed';
                }
            });
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
                            onMouseEnter={annualizePointedDateAndUnappointableDaysPointed}
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
                            )} ${defineUnappointableDayClassName(dayCorrespondingToCalendar)} ${
                                presentMonthDaysClassNamesCombined
                                    ? presentMonthDaysClassNamesCombined!(dayCorrespondingToCalendar)
                                    : ''
                            }`}
                            onClick={() => {
                                pickDate(dayCorrespondingToCalendar);
                            }}
                            onMouseLeave={() => {
                                setUnappointableDaysPointed(false);
                            }}
                            onMouseEnter={() => {
                                const dateForCurrentDay = new Date(
                                    generateAppointmentDateString(
                                        datePickerDate.year,
                                        datePickerDate.month,
                                        dayCorrespondingToCalendar
                                    )
                                );

                                if (datesForAppointment?.beginningDate) {
                                    const beginningDate = new Date(
                                        `${datesForAppointment.beginningDate}T14:00:00.000Z`
                                    );
                                    const numberOfDays =
                                        (dateForCurrentDay.getTime() - beginningDate.getTime()) / (1000 * 3600 * 24);

                                    const dates: Date[] = [];
                                    const beginningRange = `${beginningDate.getFullYear()}, ${
                                        beginningDate.getMonth() + 1
                                    }`;
                                    const ranges: string[] = [beginningRange];

                                    setPointedDate(dateForCurrentDay);

                                    for (let i = 1; i < numberOfDays + 1; i++) {
                                        const date = new Date(beginningDate.getTime() + 1000 * 3600 * 24 * i);

                                        dates.push(date);

                                        // NOTE: we changed i from 0 to 1 and thus if we return changes we need to do i !== 0 instead of i === 1
                                        if (i !== 1 && date.getDate() === 1) {
                                            ranges.push(`${date.getFullYear()}, ${date.getMonth()}`);
                                        }
                                    }
                                    console.log(dates);

                                    ranges.forEach((range, i) => {
                                        if (parsedAppointmentsList[range]) {
                                            dates.forEach((date) => {
                                                for (const appointmentsForPeriod of parsedAppointmentsList[range]) {
                                                    console.log(
                                                        date,
                                                        new Date(appointmentsForPeriod.endingDateWithTimestamp)
                                                    );

                                                    if (
                                                        date >=
                                                            new Date(
                                                                appointmentsForPeriod.beginningDateWithTimestamp
                                                            ) &&
                                                        date < new Date(appointmentsForPeriod.endingDateWithTimestamp)
                                                    ) {
                                                        setUnappointableDaysPointed(true);

                                                        return;
                                                    }
                                                }
                                            });
                                        }
                                    });
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
    const renderAppointButton = (): JSX.Element | null => {
        const datesArePicked = datesForAppointment?.beginningDate && datesForAppointment?.endingDate;

        const defineAvailableOrNonAvailableButtonClassName = (): string => {
            return datesArePicked ? 'button--available button--primary' : 'button--unavailable';
        };

        const appointSpace = (): void => {
            if (datesArePicked) {
                // dispatch
                // not dispatch. open a confirm dialog first

                toggleConfirmAppointmentDialog();
            }
        };

        return (
            <div className="appoint-button-container">
                <div
                    className={`button appoint-button ${defineAvailableOrNonAvailableButtonClassName()}`}
                    onClick={appointSpace}
                >
                    Забронировать
                </div>
            </div>
        );
    };
    const renderConfirmAppointmentDialog = (): JSX.Element | void => {
        const handlePositiveClick: MouseEventHandler<HTMLDivElement> = () => {
            const payload: ICreateAppointmentPayload = {
                resIsoDatesToReserve: {
                    beginningDate: datesForAppointment?.beginningDate,
                    endingDate: datesForAppointment?.endingDate,
                },
                spaceId: spaceId!,
            };

            dispatch(postCreateAppointmentAction(payload));
        };

        if (confirmAppointmentIsOpen) {
            return (
                <ConfirmDialog
                    question={`Забронировать с ${datesForAppointment?.beginningDate}, 14:00, до ${datesForAppointment?.endingDate}?`}
                    positive={'Нет'}
                    negative={'Да'}
                    handlePositiveClick={handlePositiveClick}
                    handleNegativeClick={toggleConfirmAppointmentDialog}
                    handleCloseButtonClick={toggleConfirmAppointmentDialog}
                />
            );
        }
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
    useEffect(() => {
        document.addEventListener('mouseleave', (e) => {
            document.querySelectorAll('.table-cell--unappointable').forEach((el) => {});
        });
    });

    return (
        <>
            <div
                className={`${componentClassNames || ''} date-picker appointment-date-picker`}
                onClick={(e) => e.stopPropagation()}
                ref={innerRef ?? undefined}
            >
                <div>
                    {renderDatePickerControlPanel()}
                    <table className="date-picker__table">
                        <tbody onMouseLeave={annualizePointedDateAndUnappointableDaysPointed}>
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
                </div>
                {renderAppointButton()}
            </div>
            {renderConfirmAppointmentDialog()}
        </>
    );
}
