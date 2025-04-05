import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';

const ProtectedLayout = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return (
    <div className="App">
      <Navbar />
      <Outlet /> {/* This renders the nested routes */}
    </div>
  );
};

export default ProtectedLayout;