import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { toggleLoginModalAction, toggleSignupModalAction } from '../redux/actions/modalActions';
import { IReduxState } from '../redux/reducers/rootReducer';
import { UrlPathname } from '../types/types';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';

export default function AuthModals(): JSX.Element {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const { loginModalIsOpen, signupModalIsOpen } = useSelector((state: IReduxState) => state.modalStorage);

    const dispatch = useDispatch();
    const location = useLocation();

    const userLoginState = fetchUserLoginStateSuccessResponse?.data;

    const toggleLoginModal = (): void => {
        dispatch(toggleLoginModalAction());
    };
    const toggleSignupModal = (): void => {
        dispatch(toggleSignupModalAction());
    };

    const userIsNotLoggedInAndAuthLinkIsNotDirect =
        !userLoginState?.loggedIn &&
        location.pathname !== UrlPathname.LOGIN &&
        location.pathname !== UrlPathname.SIGNUP;

    const renderLoginModal = (): JSX.Element | null => {
        return userIsNotLoggedInAndAuthLinkIsNotDirect && loginModalIsOpen ? (
            <LoginModal
                mainDivClassName="navbar__elem invisible--phone login-container"
                toggleLoginModal={toggleLoginModal}
            />
        ) : null;
    };
    const renderSignupModal = (): JSX.Element | null => {
        return userIsNotLoggedInAndAuthLinkIsNotDirect && signupModalIsOpen ? (
            <SignupModal
                mainDivClassName="navbar__elem invisible--phone login-container"
                toggleSignupModal={toggleSignupModal}
            />
        ) : null;
    };

    return (
        <>
            {renderLoginModal()}
            {renderSignupModal()}
        </>
    );
}
