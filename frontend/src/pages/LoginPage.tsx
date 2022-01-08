import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IReduxState } from '../redux/reducers/rootReducer';

export default function LoginPage(): JSX.Element {
    const { userLoginState } = useSelector((state: IReduxState) => state.authStorage);

    useEffect(() => {
        const a = (): void => {
            console.log(userLoginState);

            if (!userLoginState.loggedIn && window.location.pathname === '/provide-space') {
                window.history.back();
            }
        };

        window.addEventListener('popstate', a);

        return () => {
            window.removeEventListener('popstate', a);
        };
    }, [userLoginState]);

    return <div className="login-page-section"></div>;
}
