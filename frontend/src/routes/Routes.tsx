import { Route, Routes as ReactRoutes } from 'react-router-dom';
import AboutUsPage from '../pages/AboutUsPage';
import ContactUsPage from '../pages/ContactUsPage';
import CreateSpacePage from '../pages/CreateSpacePage';
import ForInvestorsPage from '../pages/ForInvestorsPage';
import { HomePage } from '../pages/HomePage';
import NotFoundPage from '../pages/NotFoundPage';
import SettingsPage from '../pages/SettingsPage';
import SpacePage from '../pages/SpacePage';

export default function Routes() {
    return (
        <ReactRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/provide-space" element={<CreateSpacePage />} />
            <Route path="/spaces" element={<HomePage />} />
            <Route path="/spaces/:spaceId" element={<SpacePage />} />
            <Route path="/users/:userId/settings" element={<SettingsPage />} />
            <Route path="/about" element={<AboutUsPage />} />
            <Route path="/contact" element={<ContactUsPage />} />
            <Route path="/for-inverstors" element={<ForInvestorsPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </ReactRoutes>
    );
}
