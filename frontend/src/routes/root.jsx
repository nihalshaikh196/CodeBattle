import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RootRoute = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.userType === 'admin' ? '/admin/home' : '/user/home'} replace />;
  }

  // If not authenticated, redirect to login
  return <Navigate to="/auth/login" replace />;
};

export default RootRoute;