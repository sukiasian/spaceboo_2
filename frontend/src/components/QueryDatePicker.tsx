import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFetchSpacesQueryDataAction } from '../redux/actions/spaceActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { formatSingleDigitUnitToTwoDigitString } from '../utils/utilFunctions';
import DatePicker from './DatePicker';
import { IDatesRange, IQueryData } from './Filters';

interface IQueryDatePicker {
    datesForRender: IDatesRange | undefined;
    setDatesForRender: React.Dispatch<React.SetStateAction<IDatesRange | undefined>>;
}

export default function QueryDatePicker(props: IQueryDatePicker): JSX.Element {
    // const { queryData, setQueryData } = props;
    const { datesForRender, setDatesForRender } = props;
    const { fetchSpacesQueryData } = useSelector((state: IReduxState) => state.spaceStorage);
    const { datePickerDate } = useSelector((state: IReduxState) => state.commonStorage);
    const dispatch = useDispatch();
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
    const firstDateIsGreaterThanSecond = (d1: string, d2: string): boolean => {
        return new Date(d1) > new Date(d2);
    };
    const pickDate = (day: number) => {
        const newQueryData: IQueryData = { ...fetchSpacesQueryData };
        const newDatesForRender: IDatesRange = { ...datesForRender };
        const pickedDate = generateQueryDateString(datePickerDate.year, datePickerDate.month, day);
        const pickedDateForRender = generateRenderDateString(datePickerDate.year, datePickerDate.month, day);

        if (newQueryData.beginningDate && newQueryData.endingDate) {
            // if you click on chosen one
            if (newQueryData.beginningDate === pickedDate || newQueryData.endingDate === pickedDate) {
                newQueryData.beginningDate = pickedDate;
                newQueryData.endingDate = generateQueryDateString(datePickerDate.year, datePickerDate.month, day + 1);
                newDatesForRender.beginningDate = pickedDateForRender;
                newDatesForRender.endingDate = generateRenderDateString(
                    datePickerDate.year,
                    datePickerDate.month,
                    day + 1
                );
            }
            // if you first click on high value then on lower value
            else if (firstDateIsGreaterThanSecond(newQueryData.beginningDate, pickedDate)) {
                newQueryData.endingDate = newQueryData.beginningDate;
                newQueryData.beginningDate = pickedDate;
                newDatesForRender.endingDate = newDatesForRender.beginningDate;
                newDatesForRender.beginningDate = pickedDateForRender;
            } else {
                newQueryData.endingDate = pickedDate;
                newDatesForRender.endingDate = pickedDateForRender;
            }
        } else {
            newQueryData.beginningDate = pickedDate;
            newQueryData.endingDate = generateQueryDateString(datePickerDate.year, datePickerDate.month, day + 1);
            newDatesForRender.beginningDate = pickedDateForRender;
            newDatesForRender.endingDate = generateRenderDateString(datePickerDate.year, datePickerDate.month, day + 1);
        }

        dispatch(setFetchSpacesQueryDataAction(newQueryData));
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
                return 'date-picker__table__cell--at-border--left';
            } else if (dateForCurrentDay >= endingDate && endingDate >= dateForCurrentDay) {
                return 'date-picker__table__cell--at-border--right';
            } else if (dateForCurrentDay > beginningDate && dateForCurrentDay < endingDate) {
                return 'date-picker__table__cell--picked';
            }
        }

        return '';
    };
    const combinePresentMonthDaysClassNames = (day: number): string => {
        return `${definePickedDaysClassName(day)}`;
    };

    return (
        <DatePicker handlePickDate={pickDate} presentMonthDaysClassNamesCombined={combinePresentMonthDaysClassNames} />
    );
}
