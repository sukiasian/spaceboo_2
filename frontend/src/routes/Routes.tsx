import { Route, Routes as ReactRoutes } from 'react-router-dom';
import { HomePage } from '../pages/HomePage';

export default function Routes() {
    return (
        <ReactRoutes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path='/' element={}> */}
        </ReactRoutes>
    );
}
