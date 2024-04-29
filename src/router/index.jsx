// react router
import { Routes, Route } from 'react-router-dom';

import CustomersPage from '@/pages/CustomersPage';

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<CustomersPage />} />
        </Routes>
    )
}

export default AppRouter;