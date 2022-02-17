import { Routes, Route } from 'react-router-dom';
import GeneralSettingsPage from '../pages/GeneralSettingsPage';
import SecuritySettingsPage from '../pages/SecuritySettingsPage';

export default function SettingsPageRoutes(): JSX.Element {
    return (
        <Routes>
            <Route path="general" element={<GeneralSettingsPage />} />
            <Route path="security" element={<SecuritySettingsPage />} />
        </Routes>
    );
}
