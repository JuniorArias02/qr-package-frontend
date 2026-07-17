import SuperAdminDashboard from '../pages/Dashboard';
import CompanyGeneralDetail from '../pages/CompanyGeneralDetail';
import CompanyForm from '../pages/CompanyForm';
import CompanyFormList from '../pages/CompanyFormList';
import GlobalDeliveries from '../pages/GlobalDeliveries';
import UserGlobal from '../pages/UserGlobal';
import UserGlobalForm from '../pages/UserGlobalForm';

export const superAdminRoutes = [
  { path: '/super-admin/dashboard', element: <SuperAdminDashboard /> },
  { path: '/super-admin/companies', element: <CompanyFormList /> },
  { path: '/super-admin/companies/new', element: <CompanyForm /> },
  { path: '/super-admin/companies/:id/edit', element: <CompanyForm /> },
  { path: '/super-admin/companies/:id/detail', element: <CompanyGeneralDetail /> },
  { path: '/super-admin/deliveries', element: <GlobalDeliveries /> },
  { path: '/super-admin/users', element: <UserGlobal /> },
  { path: '/super-admin/users/new', element: <UserGlobalForm /> },
  { path: '/super-admin/users/:id/edit', element: <UserGlobalForm /> }
];
