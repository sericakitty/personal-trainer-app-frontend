// react router
import { Routes, Route } from 'react-router-dom';

import CustomersPage from '../pages/CustomersPage';
import TrainingsPage from '../pages/TrainingsPage';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomersPage />} />
            <Route path="/trainings" element={<TrainingsPage />} />
        </Routes>
    )
}

export default AppRouter;