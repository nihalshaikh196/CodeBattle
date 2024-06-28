
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import AuthRoutes from "./auth.jsx";
import UserRoutes from "./user.jsx";
import AdminRoutes from "./admin.jsx";
import Unauthorized from "../views/Auth/Unauthorized.jsx";
import { AuthProvider } from "../contexts/AuthContext.jsx";
// import { useEffect } from "react";
// import { useAuth } from "../contexts/AuthContext.jsx";

const AppRoutes = () => {
  // const { checkAuth } = useAuth();
  // useEffect(() => {
  //   checkAuth();
  // }, []);
  // const {user} = useAuth();
  return (
  <Router>
    <AuthProvider>
    <Routes>
      
      <Route path="/*" element={<AuthRoutes />} />
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/user" element={<Navigate to="/user/home" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/home" replace />} />
    </Routes>
    </AuthProvider>
  </Router>);
};

export default AppRoutes;
