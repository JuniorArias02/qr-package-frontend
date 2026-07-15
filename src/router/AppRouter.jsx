import { createBrowserRouter } from 'react-router-dom';
import Layout from '../layouts/Layout';

import { authRoutes } from '../domains/auth/routers/authRouter';
import { adminRoutes } from '../domains/admin/routers/adminRouter';
import { coordinatorRoutes } from '../domains/coordinator/routers/coordinatorRouter';
import { driverRoutes } from '../domains/driver/routers/driverRouter';
import { profileRoutes } from '../domains/profile/routers/profileRouter';
import { superAdminRoutes } from '../domains/superAdmin/routers/superAdminRouter';
// import { usersRoutes } from '../domains/users/routers/usersRouter';
// import { packagesRoutes } from '../domains/packages/routers/packagesRouter';

import DashboardRedirect from '../core/auth/DashboardRedirect';

export const AppRouter = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      ...authRoutes, // Spreading the auth routes directly into the Layout
      ...adminRoutes, // Spreading the admin routes
      ...coordinatorRoutes, // Spreading the coordinator routes
      ...driverRoutes, // Spreading the driver routes
      ...profileRoutes, // Spreading the profile routes
      ...superAdminRoutes, // Spreading the superAdmin routes
      {
        path: 'dashboard',
        element: <DashboardRedirect />
      },
      // When domains are created, spread their routes here:
      // ...usersRoutes,
      // ...packagesRoutes,
      {
        path: '*',
        element: (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-5xl font-black text-slate-900 mb-4">404</h1>
            <p className="text-slate-500 font-medium">The page you are looking for does not exist.</p>
          </div>
        )
      }
    ],
  },
]);
