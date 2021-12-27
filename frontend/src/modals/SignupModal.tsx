import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom'; // NOTE for signup
import { IReduxState } from '../redux/reducers/rootReducer';
import { toggleLoginModalAction, toggleSignupModalAction } from '../redux/actions/modalActions';
import { IComponentDivProps } from '../types/types';
import ModalsTitle from '../components/ModalsTitle';
import { annualizeSignupResponse } from '../redux/actions/authActions';
import SignupForm from '../components/SignupForm';
import SwitchTypeOfAuth, { SwitchModalFor } from '../components/SwitchAuthModal';

interface ISignupModal extends IComponentDivProps {}

export default function SignupModal(props: ISignupModal): JSX.Element {
    const { signupModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);
    const dispatch = useDispatch();
    const openSignupModal = (): void => {
        dispatch(toggleSignupModalAction());
    };
    const handleAfterSignup = (): void => {
        dispatch(toggleSignupModalAction());
        dispatch(annualizeSignupResponse());
    };
    const renderSingupModalBox = (): JSX.Element | void => {
        if (signupModalIsOpen) {
            return (
                <div className="signup-modal">
                    <ModalsTitle
                        mainDivClassName="login-modal__title"
                        modalsHeading="Приветствуем Вас!"
                        modalsParagraph="Зарегистрируйтесь, чтобы продолжить."
                    />
                    <SignupForm handleAfterSignup={handleAfterSignup} />
                    <SwitchTypeOfAuth
                        mainDivClassName="signin"
                        switchQuestion="Уже есть аккаунт?"
                        switchCallToAction="Войдите"
                        switchFor={SwitchModalFor.SIGNUP}
                        openingModalAction={toggleLoginModalAction}
                        closingModalAction={toggleSignupModalAction}
                    />
                </div>
            );
        }
    };

    return (
        <div className={props.mainDivClassName}>
            <div className="heading heading--tertiary" onClick={openSignupModal}>
                Зарегистрируйтесь
            </div>
            {renderSingupModalBox()}
        </div>
    );
}
