import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import AboutPage from '../pages/AboutPage';
import ConfirmAccountPage from '../pages/ConfirmAccountPage';
import ContactPage from '../pages/ContactPage';
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
import SpaceKeysPage from '../pages/SpaceKeysPage';

// FIXME много повторяющегося кода
export default function AppRoutes(): JSX.Element {
    const { fetchUserLoginStateSuccessResponse } = useSelector((state: IReduxState) => state.authStorage);
    const userLoginState = fetchUserLoginStateSuccessResponse?.data;

    if (userLoginState?.loggedIn && !userLoginState?.confirmed) {
        return (
            <Routes>
                <Route path="/" element={<ConfirmAccountPage />} />
                <Route path="/spaces" element={<ConfirmAccountPage />} />
                <Route path="/spaces/:spaceId" element={<SpacePage />} />
                <Route path="/provide-space" element={<ConfirmAccountPage />} />
                <Route path="/for-investors" element={<ForInvestorsPage />} />
                <Route path="/how-it-works/*" element={<HowItWorksPage />} />
                <Route path="/about/*" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        );
    }

    if (!userLoginState?.loggedIn) {
        return (
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/spaces" element={<HomePage />} />
                <Route path="/spaces/:spaceId" element={<SpacePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/provide-space" element={<ProvideSpacePage />} />
                <Route path="/for-investors" element={<ForInvestorsPage />} />
                <Route path="/how-it-works/*" element={<HowItWorksPage />} />
                <Route path="/about/*" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        );
    }

    // For confirmed users
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/spaces" element={<HomePage />} />
            <Route path="/spaces/:spaceId" element={<SpacePage />} />
            <Route path="/provide-space" element={<ProvideSpacePage />} />
            <Route path="/my-spaces" element={<MySpacesPage />} />
            <Route path="/keys" element={<SpaceKeysPage />} />
            <Route path="/my-appointments/*" element={<MyAppointmentsPage />} />
            <Route path="/user/settings/*" element={<SettingsPage />} />
            <Route path="/about/*" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/for-investors" element={<ForInvestorsPage />} />
            <Route path="/how-it-works/*" element={<HowItWorksPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
