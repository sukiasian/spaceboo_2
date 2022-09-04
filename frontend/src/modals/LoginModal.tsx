import { useDispatch } from 'react-redux';
import { toggleLoginModalAction } from '../redux/actions/modalActions';
import { IComponentClassNameProps } from '../types/types';
import Titles from '../components/Titles';
import LoginForm from '../forms/LoginForm';
import { annualizeLoginResponseAction, fetchUserLoginStateAction } from '../redux/actions/authActions';
import { SwitchAuthForModal, SwitchModalFor } from '../components/SwitchAuthForModal';
import DarkScreen from '../hoc/DarkScreen';

type ILoginModalProps = IComponentClassNameProps & { toggleLoginModal: () => void };

export default function LoginModal({ toggleLoginModal }: ILoginModalProps) {
    const dispatch = useDispatch();

    const handleAfterLogin = () => {
        dispatch(toggleLoginModalAction());
        dispatch(annualizeLoginResponseAction());
        dispatch(fetchUserLoginStateAction());
    };

    // NOTEe WHEN you navigate to another url the modal should be closed - even if we make user be unable to move through the interface he still may navigate through url
    return (
        <DarkScreen handleCloseButtonClick={toggleLoginModal}>
            <div className="modal auth-modal login-modal" onClick={(e) => e.stopPropagation()}>
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
                />
                {/* <p className="login-modal__forgot-password">Забыли пароль?</p> */}
            </div>
        </DarkScreen>
    );
}
