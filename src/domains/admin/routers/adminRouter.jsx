import AdminDashboard from '../pages/Dashboard';
import Coordinators from '../pages/Coordinators';
import CoordinatorsForm from '../pages/CoordinatorsForm';

import ReportsDashboard from '../../coordinator/pages/ReportsDashboard';

export const adminRoutes = [
  { path: '/admin/dashboard', element: <AdminDashboard /> },
  { path: '/admin/coordinators', element: <Coordinators /> },
  { path: '/admin/coordinators/new', element: <CoordinatorsForm /> },
  { path: '/admin/coordinators/:id/edit', element: <CoordinatorsForm /> },
  { path: '/reports', element: <ReportsDashboard /> }
];
