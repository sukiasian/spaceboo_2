import { Routes, Route } from 'react-router-dom';
import AboutGeneralPage from '../pages/AboutGeneralPage';
import AboutMissionPage from '../pages/AboutMissionPage';
import AboutVisionPage from '../pages/AboutVisionPage';

export default function AboutRoutes(): JSX.Element {
    return (
        <Routes>
            <Route path="general" element={<AboutGeneralPage />} />
            <Route path="mission" element={<AboutMissionPage />} />
            <Route path="vision" element={<AboutVisionPage />} />
        </Routes>
    );
}
