import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IReduxState } from '../redux/reducers/rootReducer';
import { toggleLoginModalAction, toggleSignupModalAction } from '../redux/actions/modalActions';
import { IComponentClassNameProps, TActiveTab, UrlPathname } from '../types/types';
import Titles from '../components/Titles';
import { annualizeSignupResponseAction, fetchUserLoginStateAction } from '../redux/actions/authActions';
import SignupForm from '../forms/SignupForm';
import { SwitchAuthForModal, SwitchModalFor } from '../components/SwitchAuthForModal';

type ISignupModalProps = IComponentClassNameProps & TActiveTab;

export default function SignupModal(props: ISignupModalProps): JSX.Element {
    const { signupModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);
    const dispatch = useDispatch();
    const location = useLocation();
    const openSignupModal = (): void => {
        if (location.pathname !== UrlPathname.SIGNUP) {
            dispatch(toggleSignupModalAction());
        }
    };
    const handleSignupButton = (): void => {
        props.handleActiveTab!('signup');
        openSignupModal();
    };
    const handleAfterSignup = (): void => {
        dispatch(fetchUserLoginStateAction());
        dispatch(annualizeSignupResponseAction());
        dispatch(toggleSignupModalAction());
    };
    const renderSingupModalBox = (): JSX.Element | void => {
        if (signupModalIsOpen) {
            return (
                <div className="modal auth-modal signup-modal">
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
                        openingModalAction={toggleLoginModalAction}
                        closingModalAction={toggleSignupModalAction}
                    />
                </div>
            );
        }
    };

    return (
        <div className={props.mainDivClassName}>
            <div className="heading heading--tertiary" onClick={handleSignupButton}>
                Зарегистрироваться
            </div>
            {renderSingupModalBox()}
        </div>
    );
}
