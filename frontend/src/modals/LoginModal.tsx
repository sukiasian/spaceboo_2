import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom'; // NOTE for signup
import { IReduxState } from '../redux/reducers/rootReducer';
import { toggleLoginModalAction, toggleSignupModalAction } from '../redux/actions/modalActions';
import { IComponentDivProps } from '../types/types';
import { toggleLoginOrSignupModal } from '../utils/utilFunctions';
import ModalsTitle from '../components/ModalsTitle';
import LoginForm from '../components/LoginForm';
import { annualizeLoginResponseAction } from '../redux/actions/authActions';
import SwitchTypeOfAuth, { SwitchModalFor } from '../components/SwitchAuthModal';

interface ILoginModal extends IComponentDivProps {}

export default function LoginModal(props: ILoginModal) {
    const { loginModalIsOpen, signupModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);
    const dispatch = useDispatch();
    const handleAfterLogin = () => {
        dispatch(toggleLoginModalAction());
        dispatch(annualizeLoginResponseAction());
    };
    const renderLoginModalBox = (): JSX.Element | void => {
        if (loginModalIsOpen) {
            return (
                <div className="login-modal">
                    <ModalsTitle
                        mainDivClassName="login-modal__title"
                        modalsHeading="Мы рады вас видеть!"
                        modalsParagraph="Выполните вход, чтобы продолжить."
                    />
                    <LoginForm handleAfterLogin={handleAfterLogin} />
                    <SwitchTypeOfAuth
                        mainDivClassName="login"
                        switchQuestion="Еще не зарегистрированы?"
                        switchCallToAction="Зарегистрируйтесь"
                        switchFor={SwitchModalFor.LOGIN}
                        openingModalAction={toggleSignupModalAction}
                        closingModalAction={toggleLoginModalAction}
                    />
                </div>
            );
        }
    };

    // WHEN you navigate to another url the modal should be closed - even if we make user be unable to move through the interface he still may navigate through url
    return (
        <div className={props.mainDivClassName}>
            <div
                className="heading heading--tertiary"
                onClick={toggleLoginOrSignupModal(
                    toggleLoginModalAction,
                    toggleSignupModalAction,
                    dispatch,
                    loginModalIsOpen,
                    signupModalIsOpen
                )}
            >
                Войти
            </div>
            {renderLoginModalBox()}
        </div>
    );
}
