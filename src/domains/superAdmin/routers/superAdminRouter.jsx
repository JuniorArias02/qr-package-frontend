import SuperAdminDashboard from '../pages/Dashboard';
import CompanyGeneralDetail from '../pages/CompanyGeneralDetail';
import CompanyForm from '../pages/CompanyForm';
import CompanyFormList from '../pages/CompanyFormList';
import GlobalDeliveries from '../pages/GlobalDeliveries';
import UserGlobal from '../pages/UserGlobal';
import UserGlobalForm from '../pages/UserGlobalForm';

export const superAdminRoutes = [
  { path: '/super-admin/dashboard', element: <SuperAdminDashboard /> },
  { path: '/super-admin/company', element: <CompanyGeneralDetail /> },
  { path: '/super-admin/company/form', element: <CompanyForm /> },
  { path: '/super-admin/company/list', element: <CompanyFormList /> },
  { path: '/super-admin/deliveries', element: <GlobalDeliveries /> },
  { path: '/super-admin/users', element: <UserGlobal /> },
  { path: '/super-admin/users/form', element: <UserGlobalForm /> }
];
