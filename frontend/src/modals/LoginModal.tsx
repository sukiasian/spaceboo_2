import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../redux/reducers/rootReducer';
import { toggleLoginModalAction, toggleSignupModalAction } from '../redux/actions/modalActions';
import { IComponentClassNameProps, TActiveTab } from '../types/types';
import Titles from '../components/Titles';
import LoginForm from '../forms/LoginForm';
import { annualizeLoginResponseAction, requestUserLoginState } from '../redux/actions/authActions';
import { SwitchAuthForModal, SwitchModalFor } from '../components/SwitchAuthForModal';

type ILoginModalProps = IComponentClassNameProps & TActiveTab;

export default function LoginModal(props: ILoginModalProps) {
    const { loginModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);
    const dispatch = useDispatch();
    const openLoginModal = (): void => {
        dispatch(toggleLoginModalAction());
    };
    const handleLoginButton = (): void => {
        openLoginModal();
        props.handleActiveTab('login');
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
                    <Titles
                        mainDivClassName="login-modal__title"
                        heading="Мы рады вас видеть!"
                        paragraph="Выполните вход, чтобы продолжить."
                    />
                    <LoginForm handleAfterLogin={handleAfterLogin} />
                    <SwitchAuthForModal
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
    useEffect(() => {});
    // NOTEe WHEN you navigate to another url the modal should be closed - even if we make user be unable to move through the interface he still may navigate through url
    return (
        <div className={props.mainDivClassName}>
            <div className="heading heading--tertiary" onClick={handleLoginButton}>
                Войти
            </div>
            {renderLoginModalBox()}
        </div>
    );
}
