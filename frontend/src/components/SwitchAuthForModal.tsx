import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { toggleLoginModalAction, toggleSignupModalAction } from '../redux/actions/modalActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IComponentClassNameProps, ReduxModalAction } from '../types/types';

export enum SwitchModalFor {
    SIGNUP = 'SIGNUP',
    LOGIN = 'LOGIN',
}

// TODO чтобы использовать как компонент нам нужно создать 2 отдельных компонента - SwitchTypeOfAuth для модального окна и для страницы. Для модального использовать
// свои пропсы (которые включают openingModalAction, closingModalAction). А вообще стоит ли ? может лучше использовать в
interface ISwitchTypeOfAuthProps extends IComponentClassNameProps {
    switchQuestion: string;
    switchCallToAction: string;
    switchFor: SwitchModalFor;
}

export function SwitchAuthForModal({
    switchQuestion,
    switchCallToAction,
    mainDivClassName,
}: ISwitchTypeOfAuthProps): JSX.Element {
    const dispatch = useDispatch();

    const switchModals = (): void => {
        dispatch(toggleLoginModalAction());
        dispatch(toggleSignupModalAction());
    };

    return (
        <div className={`authorization-counter-action authorization-counter-action--${mainDivClassName}`}>
            <p className="paragraph">
                {switchQuestion}{' '}
                <span className="auth-modal-call-to-action" onClick={switchModals}>
                    {switchCallToAction}.
                </span>
            </p>
        </div>
    );
}
