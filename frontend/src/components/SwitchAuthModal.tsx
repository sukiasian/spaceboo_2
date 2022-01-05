import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { IReduxState } from '../redux/reducers/rootReducer';
import { IComponentClassNameProps, ReduxModalActions } from '../types/types';
import { toggleLoginOrSignupModal } from '../utils/utilFunctions';

export enum SwitchModalFor {
    SIGNUP = 'SIGNUP',
    LOGIN = 'LOGIN',
}

interface ISwitchTypeOfAuthProps extends IComponentClassNameProps {
    switchQuestion: string;
    switchCallToAction: string;
    switchFor: SwitchModalFor;
    openingModalAction: () => Action<ReduxModalActions>;
    closingModalAction: () => Action<ReduxModalActions>;
}

export default function SwitchTypeOfAuth(props: ISwitchTypeOfAuthProps): JSX.Element {
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
