import DriverDashboard from '../pages/Dashboard';
import Deliveries from '../pages/Deliveries';
import ScanDelivery from '../pages/ScanDelivery';
import DeliveryHistory from '../pages/DeliveryHistory';

export const driverRoutes = [
  { path: '/driver/dashboard', element: <DriverDashboard /> },
  { path: '/driver/deliveries', element: <Deliveries /> },
  { path: '/driver/scan', element: <ScanDelivery /> },
  { path: '/driver/history', element: <DeliveryHistory /> }
];
