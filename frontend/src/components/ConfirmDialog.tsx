import { RefObject, useEffect } from 'react';
import RemoveIcon from '../icons/RemoveIcon';
import { EventKey } from '../types/types';

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

    const closeDialogOnEscapePress = (e: KeyboardEvent) => {
        if (e.key === EventKey.ESCAPE) {
            handleCloseButtonClick(e);
        }
    };
    const applyEffectsOnInit = (): (() => void) => {
        document.addEventListener('keydown', closeDialogOnEscapePress);

        return () => {
            document.removeEventListener('keydown', closeDialogOnEscapePress);
        };
    };

    useEffect(applyEffectsOnInit, []);

    return (
        <div
            className="dark-screen"
            onClick={() => {
                handleCloseButtonClick();
            }}
        >
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
        </div>
    );
}
