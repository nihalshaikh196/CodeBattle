
import {
  BrowserRouter as Router,
  Routes,
  Route,
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
    </Routes>
  </Router>
);

export default AppRoutes;
