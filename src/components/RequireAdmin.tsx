import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAdmin = () => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location }} />;
  }
  if (!user.isAdmin) {
    return <Navigate to="/welcome" replace />;
  }
  return <Outlet />;
};

export default RequireAdmin;
