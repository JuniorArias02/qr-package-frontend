import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/common/RoleBasedRoute';
import { UserRole } from './types/auth.types';

// AUTH VIEWS
import Login from './views/auth/pages/Login';
import Register from './views/auth/pages/Register';
import ForgotPassword from './views/auth/pages/ForgotPassword';

// ADMIN MODULE
import AdminDashboard from './views/admin/dashboard/pages/Dashboard';
import Coordinators from './views/admin/coordinators/pages/Coordinators';
import CoordinatorsForm from './views/admin/coordinators/pages/CoordinatorsForm';

// COORDINATOR MODULE
import CoordinatorDashboard from './views/coordinator/dashboard/pages/Dashboard';
import Drivers from './views/coordinator/drivers/pages/Drivers';
import DriversForm from './views/coordinator/drivers/pages/DriversForm';
import Scan from './views/coordinator/packages/pages/Scan';
import Assignments from './views/coordinator/packages/pages/Assignments';
import ReportsDashboard from './views/coordinator/reports/pages/ReportsDashboard';

// DRIVER MODULE
import DriverDashboard from './views/driver/dashboard/pages/Dashboard';
import Deliveries from './views/driver/deliveries/pages/Deliveries';
import DeliveryHistory from './views/driver/history/pages/DeliveryHistory';
import DriverScanDelivery from './views/driver/deliveries/pages/ScanDelivery';

// PROFILE
import MyAccount from './views/myProfile/pages/MyAccount';

// SUPER ADMIN MODULE
import CompanyFormList from './views/superAdmin/company/page/CompanyFormList';
import CompanyForm from './views/superAdmin/company/page/CompanyForm';
import CompanyGeneralDetail from './views/superAdmin/company/page/CompanyGeneralDetail';
import SuperAdminDashboard from './views/superAdmin/dashboard/pages/Dashboard';
import UserGlobal from './views/superAdmin/userGlobal/pages/UserGlobal';
import UserGlobalForm from './views/superAdmin/userGlobal/pages/UserGlobalForm';
import GlobalDeliveries from './views/superAdmin/deliveriesGlobal/pages/GlobalDeliveries';

import DashboardRedirect from './components/DashboardRedirect';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* Smart redirection for home and general dashboard */}
                    <Route path="/" element={<DashboardRedirect />} />
                    <Route path="/dashboard" element={<DashboardRedirect />} />

                    {/* PROTECTED ROUTES */}
                    <Route element={<ProtectedRoute />}>

                        {/* SUPER ADMIN ROUTES */}
                        <Route element={<RoleBasedRoute allowedRoles={[UserRole.SUPER_ADMIN]} />}>
                            <Route path="/super-admin/dashboard" element={<SuperAdminDashboard />} />
                            <Route path="/super-admin/companies" element={<CompanyFormList />} />
                            <Route path="/super-admin/companies/new" element={<CompanyForm />} />
                            <Route path="/super-admin/companies/:id/edit" element={<CompanyForm />} />
                            <Route path="/super-admin/companies/:id/detail" element={<CompanyGeneralDetail />} />
                            <Route path="/super-admin/users" element={<UserGlobal />} />
                            <Route path="/super-admin/users/new" element={<UserGlobalForm />} />
                            <Route path="/super-admin/users/:id/edit" element={<UserGlobalForm />} />
                            <Route path="/super-admin/deliveries" element={<GlobalDeliveries />} />
                        </Route>

                        {/* ADMIN ROUTES */}
                        <Route element={<RoleBasedRoute allowedRoles={[UserRole.COMPANY_ADMIN]} />}>
                            <Route path="/admin/dashboard" element={<AdminDashboard />} />
                            <Route path="/admin/coordinators" element={<Coordinators />} />
                            <Route path="/admin/coordinators/new" element={<CoordinatorsForm />} />
                            <Route path="/admin/coordinators/:id/edit" element={<CoordinatorsForm />} />
                        </Route>

                        {/* COORDINATOR ROUTES */}
                        <Route element={<RoleBasedRoute allowedRoles={[UserRole.COORDINATOR]} />}>
                            <Route path="/coordinator/dashboard" element={<CoordinatorDashboard />} />
                            <Route path="/coordinator/drivers" element={<Drivers />} />
                            <Route path="/coordinator/drivers/new" element={<DriversForm />} />
                            <Route path="/coordinator/drivers/:id/edit" element={<DriversForm />} />
                            <Route path="/coordinator/scan" element={<Scan />} />
                            <Route path="/coordinator/assignments" element={<Assignments />} />
                            <Route path="/coordinator/reports" element={<ReportsDashboard />} />
                        </Route>

                        {/* DRIVER ROUTES */}
                        <Route element={<RoleBasedRoute allowedRoles={[UserRole.DRIVER]} />}>
                            <Route path="/driver/dashboard" element={<DriverDashboard />} />
                            <Route path="/driver/deliveries" element={<Deliveries />} />
                            <Route path="/driver/scan" element={<DriverScanDelivery />} />
                            <Route path="/driver/history" element={<DeliveryHistory />} />
                        </Route>

                        {/* COMMON PROTECTED ROUTES */}
                        <Route path="/profile" element={<MyAccount />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
