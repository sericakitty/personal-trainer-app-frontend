// react router
import { Routes, Route } from 'react-router-dom';

import CustomersPage from '@/pages/CustomersPage';
import TrainingsPage from '@/pages/TrainingsPage';
import CalendarPage from '@/pages/CalendarPage';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomersPage />} />
            <Route path="/trainings" element={<TrainingsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
    )
}

export default AppRouter;