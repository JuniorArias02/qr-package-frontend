import CoordinatorDashboard from '../pages/Dashboard';
import Drivers from '../pages/Drivers';
import DriversForm from '../pages/DriversForm';
import Scan from '../pages/Scan';
import Assignments from '../pages/Assignments';
import ReportsDashboard from '../pages/ReportsDashboard';

export const coordinatorRoutes = [
  { path: '/coordinator/dashboard', element: <CoordinatorDashboard /> },
  { path: '/coordinator/drivers', element: <Drivers /> },
  { path: '/coordinator/drivers/new', element: <DriversForm /> },
  { path: '/coordinator/drivers/:id/edit', element: <DriversForm /> },
  { path: '/coordinator/scan', element: <Scan /> },
  { path: '/coordinator/assignments', element: <Assignments /> },
  { path: '/coordinator/reports', element: <ReportsDashboard /> }
];
