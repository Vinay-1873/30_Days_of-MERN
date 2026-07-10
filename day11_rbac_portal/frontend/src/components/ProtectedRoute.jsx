import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  // 1. Not logged in? Kick to login screen.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Role not authorized? Kick to a safe page.
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Authorized? Render the child components.
  return <Outlet />;
};

export default ProtectedRoute;