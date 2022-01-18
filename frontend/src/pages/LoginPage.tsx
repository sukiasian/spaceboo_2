import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LoginForm from '../forms/LoginForm';
import { IReduxState } from '../redux/reducers/rootReducer';
import SwitchAuthForPage from '../components/SwitchAuthForPage';
import { UrlPathnames } from '../types/types';

export default function LoginPage(): JSX.Element {
    const { userLoginState } = useSelector((state: IReduxState) => state.authStorage);
    const handleHistoryBack = (): (() => void) => {
        const getBack = (): void => {
            if (!userLoginState.loggedIn && window.location.pathname === '/provide-space') {
                window.history.back();
            }
        };

        window.addEventListener('popstate', getBack);

        return () => {
            window.removeEventListener('popstate', getBack);
        };
    };
    const handleAfterLogin = (): void => {};

    useEffect(handleHistoryBack, [userLoginState]);

    return (
        <div className="login-page-section">
            <div className="login-page__title">
                <h2 className="heading heading--secondary login-page-title__heading">Выполните вход</h2>
            </div>
            <LoginForm handleAfterLogin={handleAfterLogin} />
            <SwitchAuthForPage
                question="Еще нет аккаунта?"
                action="Зарегистрируйтесь!"
                mainDivClassName="login"
                navigateTo={UrlPathnames.SIGNUP}
            />
        </div>
    );
}