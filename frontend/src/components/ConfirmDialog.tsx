import { RefObject, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DarkScreen from '../hoc/DarkScreen';
import HideComponentOnOutsideClickOrEscapePress from '../hoc/HideComponentOnOutsideClickOrEscapePress';
import RemoveIcon from '../icons/RemoveIcon';
import { toggleConfirmDialogAction } from '../redux/actions/modalActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { stopPropagation } from '../utils/utilFunctions';

interface IConfirmDialogProps {
    question: string;
    positive: string;
    negative: string;
    handlePositiveClick: (...props: any) => any;
    handleNegativeClick: (...props: any) => any;
    handleCloseButtonClick: (...props: any) => any;
}

export default function ConfirmDialog(props: IConfirmDialogProps): JSX.Element | null {
    const { question, positive, negative, handlePositiveClick, handleNegativeClick, handleCloseButtonClick } = props;

    const { confirmDialogIsOpen } = useSelector((state: IReduxState) => state.modalStorage);

    const componentRef = useRef(null);

    const dispatch = useDispatch();

    const toggleConfirmDialog = (): void => {
        dispatch(toggleConfirmDialogAction());
    };

    return confirmDialogIsOpen ? (
        <HideComponentOnOutsideClickOrEscapePress innerRef={componentRef} handleHideComponent={toggleConfirmDialog}>
            <DarkScreen>
                <div className="confirm-dialog" onClick={stopPropagation}>
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
        </HideComponentOnOutsideClickOrEscapePress>
    ) : null;
}
