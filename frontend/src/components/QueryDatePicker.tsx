import React, { RefObject, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { annualizeFetchSpacesResponsesAction, setFetchSpacesQueryDataAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { formatSingleDigitUnitToTwoDigitString } from '../utils/utilFunctions';
import DatePicker from './DatePicker';
import { IDatesRange } from './Filters';

interface IQueryDatePicker {
    datesForRender: IDatesRange | undefined;
    setDatesForRender: React.Dispatch<React.SetStateAction<IDatesRange | undefined>>;
    innerRef?: RefObject<HTMLDivElement>;
}

export default function QueryDatePicker(props: IQueryDatePicker): JSX.Element {
    const { datesForRender, setDatesForRender, innerRef } = props;
    const [datesForQuery, setDatesForQuery] = useState<IDatesRange>();
    const { fetchSpacesQueryData } = useSelector((state: IReduxState) => state.spaceStorage);
    const { datePickerDate } = useSelector((state: IReduxState) => state.commonStorage);
    const dispatch = useDispatch();
    const generateQueryDateString = (year: number, month: number, day: number, isEnding = false): string => {
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
        const newDatesForQuery: IDatesRange = { ...datesForQuery };
        const newDatesForRender: IDatesRange = { ...datesForRender };

        const pickedDate = generateQueryDateString(datePickerDate.year, datePickerDate.month, day);
        const pickedDateForRender = generateRenderDateString(datePickerDate.year, datePickerDate.month, day);

        const now = new Date();
        const currentDate = {
            year: now.getFullYear(),
            month: now.getMonth(),
            day: now.getDate(),
        };

        //  if a day is in the past
        if (datePickerDate.month === currentDate.month && day < currentDate.day) {
            return;
        } else {
            if (newDatesForQuery.beginningDate && newDatesForQuery.endingDate) {
                // if you click on chosen one
                if (newDatesForQuery.beginningDate === pickedDate || newDatesForQuery.endingDate === pickedDate) {
                    newDatesForQuery.beginningDate = pickedDate;
                    newDatesForQuery.endingDate = generateQueryDateString(
                        datePickerDate.year,
                        datePickerDate.month,
                        day + 1,
                        true
                    );
                    newDatesForRender.beginningDate = pickedDateForRender;
                    newDatesForRender.endingDate = generateRenderDateString(
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
                    newDatesForRender.endingDate = newDatesForRender.beginningDate;
                    newDatesForRender.beginningDate = pickedDateForRender;
                } else {
                    newDatesForQuery.endingDate = pickedDate;
                    newDatesForRender.endingDate = pickedDateForRender;
                }
            } else {
                newDatesForQuery.beginningDate = pickedDate;
                newDatesForQuery.endingDate = generateQueryDateString(
                    datePickerDate.year,
                    datePickerDate.month,
                    day + 1,
                    true
                );
                newDatesForRender.beginningDate = pickedDateForRender;
                newDatesForRender.endingDate = generateRenderDateString(
                    datePickerDate.year,
                    datePickerDate.month,
                    day + 1,
                    true
                );
            }
        }

        setDatesForQuery(newDatesForQuery);

        setDatesForRender({
            beginningDate: newDatesForRender.beginningDate,
            endingDate: newDatesForRender.endingDate,
        });
    };
    const definePickedDaysClassName = (day: number): string => {
        if (fetchSpacesQueryData?.beginningDate && fetchSpacesQueryData?.endingDate) {
            const dateForCurrentDay = new Date(generateQueryDateString(datePickerDate.year, datePickerDate.month, day));
            const beginningDate = new Date(fetchSpacesQueryData.beginningDate as string);
            const endingDate = new Date(fetchSpacesQueryData.endingDate as string);

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
    const combinePresentMonthDaysClassNames = (day: number): string => {
        return `${definePickedDaysClassName(day)}`;
    };
    const prepareNewFetchSpacesQueryDataForApplyingDateRangeFilter = (): void => {
        if (datesForQuery?.beginningDate && datesForQuery?.endingDate) {
            const newFetchSpacesQueryData = { ...fetchSpacesQueryData };

            newFetchSpacesQueryData.page = 1;
            newFetchSpacesQueryData.beginningDate = datesForQuery?.beginningDate;
            newFetchSpacesQueryData.endingDate = datesForQuery?.endingDate;

            dispatch(annualizeFetchSpacesResponsesAction());
            dispatch(setFetchSpacesQueryDataAction(newFetchSpacesQueryData));
        }
    };

    useEffect(prepareNewFetchSpacesQueryDataForApplyingDateRangeFilter, [datesForQuery]);

    return (
        <DatePicker
            componentClassNames="drop-down query-date-picker"
            handlePickDate={pickDate}
            presentMonthDaysClassNamesCombined={combinePresentMonthDaysClassNames}
            innerRef={innerRef}
        />
    );
}
