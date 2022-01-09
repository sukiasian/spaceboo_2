import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from '../redux/reducers/rootReducer';
import DatePicker from './DatePicker';

export default function AppointmentDatePicker(): JSX.Element {
    const { datePickerDate } = useSelector((state: IReduxState) => state.commonStorage);
    // useSelector unavailableDays saga
    const getUnavailableDaysForMonth = (): void => {
        // dispatch
    };
    const definePresentMonthDaysClassNames = (day: number): string => {
        let classNames: string = '';

        // if unavailableDays as string[].include(day) {
        //      classNames = classNames + '<block__element>--unavailable'
        // }

        return classNames;
    };
    const applyEffectsOnInit = (): void => {
        // get currentMonth
        // диспатч отправить запрос на эндпоинт /appointments/:spaceId ?month='5'&year='2022'
    };

    useEffect(applyEffectsOnInit, []);
    return (
        <>
            <DatePicker handlePickDate={() => {}} presentMonthDaysClassNamesCombined={() => ''} />
        </>
    );
}
