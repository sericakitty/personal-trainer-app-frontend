import { Routes, Route } from 'react-router-dom';

import CustomersPage from '@/pages/CustomersPage';
import TrainingsPage from '@/pages/TrainingsPage';
import CalendarPage from '@/pages/CalendarPage';
import StatisticsPage from '@/pages/StatisticsPage';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomersPage />} />
            <Route path="/trainings" element={<TrainingsPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
        </Routes>
    )
}

export default AppRouter;