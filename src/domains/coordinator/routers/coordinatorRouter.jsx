import CoordinatorDashboard from '../pages/Dashboard';
import Drivers from '../pages/Drivers';
import DriversForm from '../pages/DriversForm';
import Scan from '../pages/Scan';
import Assignments from '../pages/Assignments';
import ReportsDashboard from '../pages/ReportsDashboard';
import Branches from '../pages/Branches';
import BranchesForm from '../pages/BranchesForm';
import BatchDispatch from '../pages/BatchDispatch';

export const coordinatorRoutes = [
  { path: '/coordinator/dashboard', element: <CoordinatorDashboard /> },
  { path: '/coordinator/drivers', element: <Drivers /> },
  { path: '/coordinator/drivers/new', element: <DriversForm /> },
  { path: '/coordinator/drivers/:id/edit', element: <DriversForm /> },
  { path: '/coordinator/scan', element: <Scan /> },
  { path: '/coordinator/assignments', element: <Assignments /> },
  { path: '/coordinator/batch-dispatch', element: <BatchDispatch /> },
  { path: '/coordinator/branches', element: <Branches /> },
  { path: '/coordinator/branches/new', element: <BranchesForm /> },
  { path: '/coordinator/branches/:id/edit', element: <BranchesForm /> },
  { path: '/coordinator/reports', element: <ReportsDashboard /> },
  { path: '/reports', element: <ReportsDashboard /> }
];
