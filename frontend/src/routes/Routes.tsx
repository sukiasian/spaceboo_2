import { useSelector } from 'react-redux';
import { Route, Routes as ReactRoutes } from 'react-router-dom';
import AboutUsPage from '../pages/AboutUsPage';
import ConfirmAccountPage from '../pages/ConfirmAccountPage';
import ContactUsPage from '../pages/ContactUsPage';
import ForInvestorsPage from '../pages/ForInvestorsPage';
import { HomePage } from '../pages/HomePage';
import HowItWorksPage from '../pages/HowItWorksPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import SettingsPage from '../pages/SettingsPage';
import SignupPage from '../pages/SignupPage';
import SpacePage from '../pages/SpacePage';
import { IReduxState } from '../redux/reducers/rootReducer';
import ProvideSpacePage from '../pages/ProvideSpacePage';
import MyAppointmentsPage from '../pages/MyAppointmentsPage';
import MySpacesPage from '../pages/MySpacesPage';

// FIXME много повторяющегося кода
export default function Routes(): JSX.Element {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const userLoginState = fetchUserLoginStateSuccessResponse?.data;

    if (userLoginState?.loggedIn && !userLoginState?.confirmed) {
        return (
            <ReactRoutes>
                <Route path="/" element={<ConfirmAccountPage />} />
                <Route path="/spaces" element={<ConfirmAccountPage />} />
                <Route path="/spaces/:spaceId" element={<SpacePage />} />
                <Route path="/provide-space" element={<ConfirmAccountPage />} />
                <Route path="/for-inverstors" element={<ForInvestorsPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </ReactRoutes>
        );
    }

    if (!userLoginState?.loggedIn) {
        return (
            <ReactRoutes>
                <Route path="/" element={<HomePage />} />
                <Route path="/spaces" element={<HomePage />} />
                <Route path="/spaces/:spaceId" element={<SpacePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/provide-space" element={<ProvideSpacePage />} />
                <Route path="/for-inverstors" element={<ForInvestorsPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/contact" element={<ContactUsPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </ReactRoutes>
        );
    }

    // for confirmed users
    return (
        <ReactRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/spaces" element={<HomePage />} />
            <Route path="/spaces/:spaceId" element={<SpacePage />} />
            <Route path="/provide-space" element={<ProvideSpacePage />} />
            <Route path="/my-spaces" element={<MySpacesPage />} />
            <Route path="/my-appointments" element={<MyAppointmentsPage />} />
            <Route path="/users/:userId/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/for-inverstors" element={<ForInvestorsPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </ReactRoutes>
    );
}
