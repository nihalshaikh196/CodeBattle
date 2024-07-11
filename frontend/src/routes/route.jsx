
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import PropTypes from 'prop-types';
import AuthRoutes from "./auth.jsx";
import UserRoutes from "./user.jsx";
import AdminRoutes from "./admin.jsx";
import Unauthorized from "../views/Auth/Unauthorized.jsx";
import { AuthProvider,useAuth } from "../contexts/AuthContext.jsx";
import RootRoute from "./root.jsx";

const ProtectedRoute = ({ element, allowedRoles }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return element;
};

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<RootRoute />} />
          <Route path="/auth/*" element={<AuthRoutes />} />
          <Route 
            path="/user/*" 
            // element={<UserRoutes/>}
            element={<ProtectedRoute element={<UserRoutes />} allowedRoles={['user']} />} 
          />
          <Route 
            path="/admin/*" 
          //  element={<AdminRoutes/>}
            element={<ProtectedRoute element={<AdminRoutes />} allowedRoles={['admin']} />} 
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

ProtectedRoute.propTypes = {
  element: PropTypes.element.isRequired,
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default AppRoutes;
