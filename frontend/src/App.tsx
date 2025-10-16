import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { BuildingsPage } from './pages/BuildingsPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeasesPage } from './pages/LeasesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { UnitsPage } from './pages/UnitsPage';
import { UsersPage } from './pages/UsersPage';
import { LoginPage } from './pages/LoginPage';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="buildings" element={<BuildingsPage />} />
        <Route path="units" element={<UnitsPage />} />
        <Route path="leases" element={<LeasesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="users" element={<UsersPage />} />
      </Route>
    </Routes>
  );
}

export default App;
