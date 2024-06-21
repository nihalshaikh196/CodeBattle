
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import AuthRoutes from "./auth.jsx";
import UserRoutes from "./user.jsx";
import AdminRoutes from "./admin.jsx";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/*" element={<AuthRoutes />} />
      <Route path="/user/*" element={<UserRoutes />} />
      <Route path="/admin/*" element={<AdminRoutes />} />
      <Route path="/user" element={<Navigate to="/user/home" replace />} />
    </Routes>
  </Router>
);

export default AppRoutes;
