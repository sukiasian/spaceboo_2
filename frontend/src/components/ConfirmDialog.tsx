import { RefObject } from 'react';
import DarkScreen from '../hoc/DarkScreen';
import RemoveIcon from '../icons/RemoveIcon';

interface IConfirmDialogProps {
    question: string;
    positive: string;
    negative: string;
    handlePositiveClick: (...props: any) => any;
    handleNegativeClick: (...props: any) => any;
    handleCloseButtonClick: (...props: any) => any;
    innerRef?: RefObject<HTMLDivElement>;
}

export default function ConfirmDialog(props: IConfirmDialogProps): JSX.Element {
    const { question, positive, negative, handlePositiveClick, handleNegativeClick, handleCloseButtonClick } = props;

    return (
        <DarkScreen handleCloseButtonClick={handleCloseButtonClick}>
            <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
                <RemoveIcon handleClick={handleCloseButtonClick} />
                <div className="question-container">
                    <p className="paragraph">{question}</p>
                </div>
                <div className="answers-container">
                    <div className="confirm-answer confirm-answer--positive" onClick={handlePositiveClick}>
                        <p className="paragraph">{positive}</p>
                    </div>
                    <div className="confirm-answer confirm-answer--negative" onClick={handleNegativeClick}>
                        <p className="paragraph">{negative}</p>
                    </div>
                </div>
            </div>
        </DarkScreen>
    );
}
