import { MouseEventHandler } from 'react';
import RemoveIcon from '../icons/RemoveIcon';

interface IConfirmDialogProps {
    question: string;
    positive: string;
    negative: string;
    handlePositiveClick: MouseEventHandler;
    handleNegativeClick: MouseEventHandler;
    handleCloseButtonClick: MouseEventHandler;
}

export default function ConfirmDialog(props: IConfirmDialogProps): JSX.Element {
    const { question, positive, negative, handlePositiveClick, handleNegativeClick, handleCloseButtonClick } = props;

    return (
        <div className="confirm-dialog">
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
    );
}
