import { useDispatch } from 'react-redux';
import { toggleSignupModalAction } from '../redux/actions/modalActions';
import { IComponentClassNameProps } from '../types/types';
import Titles from '../components/Titles';
import { annualizeSignupResponseAction, fetchUserLoginStateAction } from '../redux/actions/authActions';
import SignupForm from '../forms/SignupForm';
import { SwitchAuthForModal, SwitchModalFor } from '../components/SwitchAuthForModal';
import DarkScreen from '../hoc/DarkScreen';
import { fetchCurrentUserAction } from '../redux/actions/userActions';
import HideComponentOnOutsideClickOrEscapePress from '../hoc/HideComponentOnOutsideClickOrEscapePress';
import { useRef } from 'react';

type ISignupModalProps = IComponentClassNameProps & { toggleSignupModal: () => void };

export default function SignupModal({ toggleSignupModal }: ISignupModalProps): JSX.Element {
    const componentRef = useRef(null);

    const dispatch = useDispatch();

    const handleAfterSignup = (): void => {
        dispatch(fetchUserLoginStateAction());
        dispatch(fetchCurrentUserAction());
        dispatch(annualizeSignupResponseAction());
        dispatch(toggleSignupModalAction());
    };

    return (
        <HideComponentOnOutsideClickOrEscapePress innerRef={componentRef} handleHideComponent={toggleSignupModal}>
            <DarkScreen>
                <div className="modal auth-modal signup-modal" onClick={(e) => e.stopPropagation()}>
                    <Titles
                        mainDivClassName="login-modal__title"
                        heading="Приветствуем Вас!"
                        paragraph="Зарегистрируйтесь, чтобы продолжить."
                    />
                    <SignupForm handleAfterSignup={handleAfterSignup} />
                    <SwitchAuthForModal
                        mainDivClassName="signin"
                        switchQuestion="Уже есть аккаунт?"
                        switchCallToAction="Войдите"
                        switchFor={SwitchModalFor.SIGNUP}
                    />
                </div>
            </DarkScreen>
        </HideComponentOnOutsideClickOrEscapePress>
    );
}
