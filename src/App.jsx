import { useEffect, useState } from 'react';
import { Navigate, Outlet, Route, BrowserRouter as Router, Routes, useLocation, useNavigate } from 'react-router-dom';
import MobileBlocker from './components/features/pos_components/MobileBlocker';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/auth/LoginPage';
import ArchivesPage from './pages/dashboard/ArchivesPage';
import AuditLogPage from './pages/dashboard/AuditLogPage';
import BarcodePage from './pages/dashboard/BarcodePage';
import DiscountPage from './pages/dashboard/DiscountPage';
import ForecastPage from './pages/dashboard/ForecastPage';
import HomePage from './pages/dashboard/HomePage';
import InventoryPage from './pages/dashboard/InventoryPage';
import AccountsPage from './pages/dashboard/ManageAccountsPage';
import RequestPage from './pages/dashboard/RequestPage';
import TransactionsPage from './pages/dashboard/TransactionsPage';
import PointOfSalePage from './pages/pos/PointOfSalePage';
import CreateTransferRequest from './pages/dashboard/CreateTransferRequest';
import { UseAuth } from './services/UseAuth';
import ProductsPage from './pages/dashboard/ProductsPage';

import RequestDetailsPage from './components/features/request_components/RequestDetailsPage'; 

// ---> FIXED DELIVERIES IMPORTS based on your exact folder structure <--- 
import DeliveriesPage from './pages/dashboard/DeliveriesPage'; 
import DeliveryConfirmationPage from './components/features/delivery_components/DeliveryConfirmationPage';

const ProtectedRoute = ({ user, allowedRoles }) => {
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.activeRole)) { 
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
      if (role === 'cashier' && path !== '/pos') {
        navigate('/pos', { replace: true });
      } 
      else if (['manager', 'owner', 'admin', 'staff'].includes(role)) {
        if (!path.startsWith('/home') && path !== '/pos') {
          navigate('/home', { replace: true });
        }
      }
    }
  }, [user?.activeRole, path, navigate]);

  return null;
}

const App = () => {
  const { user, login, logout, switchRole } = UseAuth();

  const handleSwitchAccess = () => {
    const nextRole = user.activeRole === 'manager' ? 'cashier' : 'manager';
    switchRole(nextRole);
  };

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
        <Route path='/login' 
          element={
            !user ? <LoginPage onLogin={login} /> : <Navigate to={user.activeRole === 'cashier' ? '/pos' : '/home'} replace />
          }
        />

        <Route path='/home'
          element={
            user ? <DashboardLayout user={user} onSwitchAccess={handleSwitchAccess} onLogout={logout} /> : <Navigate to='/login' replace /> 
          }
        >
          <Route index element={<HomePage role={user?.trueRole} />} />

          {/* 2. INVENTORY OPS (Manager, Owner, & Staff) */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['manager', 'owner', 'staff']} />}>
            <Route path="inventory" element={<InventoryPage role={user?.trueRole} />} />
            <Route path="requests" element={<RequestPage />} />
            <Route path="new-transfer" element={<CreateTransferRequest />} /> 
            <Route path="requests/:id" element={<RequestDetailsPage />} />
            
            {/* ---> DELIVERIES ROUTES <--- */}
            <Route path="deliveries" element={<DeliveriesPage />} />
            <Route path="deliveries/confirm/:id" element={<DeliveryConfirmationPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="forecast" element={<ForecastPage />} />
          </Route>

          {/* 3. SALES OPS (Manager & Owner Only) */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['manager', 'owner']} />}>
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="discount" element={<DiscountPage />} />
          </Route>

          {/* 4. SYSTEM MANAGEMENT (Manager, Owner, & Admin) */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['manager', 'owner', 'admin']} />}>
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="archives" element={<ArchivesPage />} />
            <Route path="audit" element={<AuditLogPage />} />
          </Route>

          {/* 5. TOOLS (Manager Only) */}
          <Route element={<ProtectedRoute user={user} allowedRoles={['manager']} />}>
            <Route path="barcode" element={<BarcodePage />} />
          </Route>
        </Route>
        
        <Route element={<ProtectedRoute user={user} allowedRoles={['manager', 'cashier']} />}>
          <Route path="/pos" element={<PointOfSalePage user={user} onLogout={logout} onSwitchAccess={handleSwitchAccess} />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;