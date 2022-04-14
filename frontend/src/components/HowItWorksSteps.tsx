import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setTruthyHowItWorksStepsUserChosen } from '../redux/actions/commonActions';

interface IHowItWorksStepsProps {
    stepTexts: string[];
}

export default function HowItWorksSteps(props: IHowItWorksStepsProps): JSX.Element {
    const { stepTexts } = props;
    const dispatch = useDispatch();
    const setUserChosenAsTruthyOnInit = (): void => {
        dispatch(setTruthyHowItWorksStepsUserChosen());
    };
    const renderSteps = (): JSX.Element[] => {
        return stepTexts.map((stepText: string, i: number) => {
            const stepNumber = i + 1;

            return (
                <div className={`user-step user-step--${i}`}>
                    <div className="user-step__number-container">
                        <p className="user-step__number">{stepNumber}</p>
                    </div>
                    <div className="user-step__text">
                        <p className="paragraph">{stepText}</p>
                    </div>
                </div>
            );
        });
    };

    useEffect(setUserChosenAsTruthyOnInit, []);

    return <div className="how-it-works__user-steps user-steps">{renderSteps()}</div>;
}
