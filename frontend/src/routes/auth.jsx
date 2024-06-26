
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../views/Auth/Login/Login.jsx";
import Register from "../views/Auth/Registration/Registration.jsx";
import ForgotPassword from "../views/Auth/Login/ForgotPass.jsx";
import GetCode from "../views/Auth/Login/GetCode.jsx";
import ResetPassword from "../views/Auth/Login/ResetPass.jsx";

function AuthRoutes() {
  return (
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" exact element={<Register />} />
        <Route path="/auth/forgotPassword" exact element={<ForgotPassword />} />
        <Route path="/auth/getCode" exact element={<GetCode />} />
        <Route path="/auth/ResetPassword" exact element={<ResetPassword />} />
        <Route path="/*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
  );
}

export default AuthRoutes;
