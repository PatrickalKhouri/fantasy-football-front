import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Allow logged-in users to access /invite/accept
  const isInviteAcceptPage = location.pathname === '/invite/accept';

  return user && !isInviteAcceptPage ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicRoute;
