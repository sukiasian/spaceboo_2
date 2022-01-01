import { useDispatch, useSelector } from 'react-redux';
// import { useNavigate } from 'react-router-dom'; // NOTE for signup
import { IReduxState } from '../redux/reducers/rootReducer';
import { toggleLoginModalAction, toggleSignupModalAction } from '../redux/actions/modalActions';
import { IComponentDivProps } from '../types/types';
import ModalsTitle from '../components/ModalsTitle';
import LoginForm from '../forms/LoginForm';
import { annualizeLoginResponseAction, requestUserLoginState } from '../redux/actions/authActions';
import SwitchTypeOfAuth, { SwitchModalFor } from '../components/SwitchAuthModal';

interface ILoginModal extends IComponentDivProps {}

export default function LoginModal(props: ILoginModal) {
    const { loginModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);
    const dispatch = useDispatch();
    const openLoginModal = (): void => {
        dispatch(toggleLoginModalAction());
    };
    const handleAfterLogin = () => {
        dispatch(toggleLoginModalAction());
        dispatch(annualizeLoginResponseAction());
        dispatch(requestUserLoginState());
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

                    <p className="login-modal__forgot-password">Забыли пароль?</p>
                </div>
            );
        }
    };

    // WHEN you navigate to another url the modal should be closed - even if we make user be unable to move through the interface he still may navigate through url
    return (
        <div className={props.mainDivClassName}>
            <div className="heading heading--tertiary" onClick={openLoginModal}>
                Войти
            </div>
            {renderLoginModalBox()}
        </div>
    );
}
