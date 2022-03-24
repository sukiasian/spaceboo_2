import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IComponentClassNameProps, ReduxModalAction } from '../types/types';
import { toggleLoginOrSignupModal } from '../utils/utilFunctions';

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
    openingModalAction: () => Action<ReduxModalAction>;
    closingModalAction: () => Action<ReduxModalAction>;
}

export function SwitchAuthForModal(props: ISwitchTypeOfAuthProps): JSX.Element {
    const dispatch = useDispatch();
    const { loginModalIsOpen, signupModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);

    return (
        <div className={`authorization-counter-action authorization-counter-action--${props.mainDivClassName}`}>
            <p className="paragraph">
                {props.switchQuestion}{' '}
                <span
                    onClick={toggleLoginOrSignupModal(
                        props.openingModalAction,
                        props.closingModalAction,
                        dispatch,
                        loginModalIsOpen,
                        signupModalIsOpen
                    )}
                >
                    {props.switchCallToAction}.
                </span>
            </p>
        </div>
    );
}
