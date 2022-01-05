import { useEffect, useRef, useState } from 'react';
import { ITimeUnits } from '../types/types';
import { formatTimeUnitToTwoDigitString } from '../utils/utilFunctions';

interface ITimerProps {
    timerRef: React.MutableRefObject<NodeJS.Timeout>;
    timeLeft: number;
}
// TODO поместить в redux
export default function Timer(props: ITimerProps): JSX.Element {
    const [timeLeft, setTimeLeft] = useState<number>(props.timeLeft);
    const [timerIsOn, setTimerIsOn] = useState(false);
    const timerRef = useRef<NodeJS.Timeout>();
    const handleInterval = (): void => {
        if (!timerIsOn && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1000);
            }, 1000);
            setTimerIsOn(true);
        } else if (timerIsOn && timeLeft <= 0) {
            clearInterval(timerRef.current!);
            setTimerIsOn(false);
        }
    };
    const applyEffectsOnInit = (): (() => void) => {
        handleInterval();

        return () => {
            clearInterval(timerRef.current!);
        };
    };
    const renderTimer = (): JSX.Element | void => {
        const timeUnits: ITimeUnits = {
            minutes: Math.floor(timeLeft / 60 / 1000),
            seconds: Math.floor((timeLeft / 1000) % 60),
        };

        if (timerIsOn) {
            return (
                <div className="timer">
                    <div className="timer__units timer__units--minute">
                        {formatTimeUnitToTwoDigitString(timeUnits.minutes!)}
                    </div>
                    <div className="timer__units-separator">:</div>
                    <div className="timer__units timer__units--seconds">
                        {formatTimeUnitToTwoDigitString(timeUnits.seconds!)}
                    </div>
                </div>
            );
        }
    };

    /* eslint-disable-next-line */
    useEffect(applyEffectsOnInit, []);

    return <section className="timer-section"> {renderTimer()} </section>;
}
