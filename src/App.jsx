import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './auth/UseAuth';
import DeliveryConfirmationPage from './components/features/delivery_components/DeliveryConfirmationPage';
import MobileBlocker from './components/features/point_of_sale_components/MobileBlocker';
import CreateTransferRequestPage from './components/features/request_components/CreateTransferRequestPage';
import RequestDetailsPage from './components/features/request_components/RequestDetailsPage';
import DashboardLayout from './layouts/DashboardLayout';
import { ArchivesPage, AuditLogPage, BarcodePage, DeliveriesPage, DiscountPage, ForecastPage, HomePage, InventoryPage, ProductsPage, RequestPage, TransactionsPage } from './pages/dashboard/index.js';
import AccountsPage from './pages/dashboard/ManageAccountsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LoginPage from './pages/LoginPage';
import PointOfSalePage from './pages/PointOfSalePage';

const ProtectedRoute = ({ user, allowedRoles }) => {
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.activeRole)) { 
    return <Navigate to="/home" replace />; 
  }
  return <Outlet />;
}

const NavigationManager = ({ user }) => {
  const navigate = useNavigate();
  const path = useLocation().pathname;

  useEffect(() => {
    if (user) {
      const role = user.activeRole;
      if (role === 'CASHIER' && path !== '/pos') {
        navigate('/pos', { replace: true });
      } 
      else if (['MANAGER', 'OWNER', 'ADMIN', 'STAFF'].includes(role)) {
        if (!path.startsWith('/home')) {
          navigate('/home', { replace: true });
        }
      }
    }
  }, [user, path, navigate]);

  return null;
};

const App = () => {
  const { user } = useAuth();

  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobileView(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobileView) { return <MobileBlocker />; }

  return (
    <Router>
      <NavigationManager user={user} />
      <Routes>
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/login' 
          element={
            !user ? <LoginPage /> : <Navigate to={user.activeRole === 'CASHIER' ? '/pos' : '/home'} replace />
          }
        />
        <Route path='/home'
          element={
            user ? <DashboardLayout user={user} /> : <Navigate to='/login' replace /> 
          }
        >
          <Route index element={<HomePage role={user?.trueRole} />} />

          {/* 1. INVENTORY & DAILY OPS (Manager, Owner, & Staff) */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['MANAGER', 'OWNER', 'STAFF']} />}>
            <Route path="inventory" element={<InventoryPage role={user?.trueRole} />} />
            <Route path="requests" element={<RequestPage />} />
            <Route path="requests/:requestId" element={<RequestDetailsPage />} />
            <Route path="requests/create" element={<CreateTransferRequestPage />} />
            <Route path="deliveries" element={<DeliveriesPage />} />
            <Route path="deliveries/confirm/:id" element={<DeliveryConfirmationPage />} />
            {/* 🔧 Barcode moved here so Staff, Manager, and Owner can access it */}
            <Route path="barcode" element={<BarcodePage />} /> 
          </Route>

          {/* 2. ANALYTICS & TRANSACTIONS (Manager & Owner Only - Hidden from Staff) */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['MANAGER', 'OWNER']} />}>
            <Route path="transactions" element={<TransactionsPage />} />
            {/* 🔧 Forecast moved here so Staff cannot access it */}
            <Route path="forecast" element={<ForecastPage />} />
          </Route>

          {/* 3. BUSINESS CONTROL (Owner Only - Hidden from Managers & Staff) */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['OWNER']} />}>
            {/* 🔧 Products and Discount moved here to match Sidebar limits */}
            <Route path="products" element={<ProductsPage />} />
            <Route path="discount" element={<DiscountPage />} />
          </Route>

          {/* 4. SYSTEM MANAGEMENT (Manager, Owner, & Admin) */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['MANAGER', 'OWNER', 'ADMIN']} />}>
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="archives" element={<ArchivesPage />} />
            <Route path="audit" element={<AuditLogPage />} />
          </Route>
        </Route>
        
        {/* POS SYSTEM */}
        <Route element={<ProtectedRoute user={user} allowedRoles={['MANAGER', 'CASHIER']} />}>
          <Route path="/pos" element={<PointOfSalePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;