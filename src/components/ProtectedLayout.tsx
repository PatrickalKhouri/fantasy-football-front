// ProtectedLayout.tsx
import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }

  // Redirect to /welcome if trying to access root
  if (location.pathname === '/') {
    return <Navigate to="/welcome" replace />;
  }

  return <Outlet />;
};

export default ProtectedLayout;