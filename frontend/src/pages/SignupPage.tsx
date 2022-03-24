import SwitchAuthPage from '../components/SwitchAuthForPage';
import { UrlPathname } from '../types/types';
import SignupForm from '../forms/SignupForm';

export default function SignupPage(): JSX.Element {
    const handleAfterSignup = (): void => {};

    return (
        <div className="login-page-section">
            <div className="login-page__title">
                <h2 className="heading heading--secondary login-page-title__heading">Зарегистрируйтесь</h2>
            </div>
            <SignupForm handleAfterSignup={handleAfterSignup} />
            <SwitchAuthPage
                question="Уже есть аккаунт?"
                action="Выполните вход!"
                mainDivClassName="signup"
                navigateTo={UrlPathname.LOGIN}
            />
        </div>
    );
}
