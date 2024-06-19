
import { Routes, Route, Navigate } from "react-router-dom";

import Contests from "../views/User/contests.jsx";
import Profile from "../views/User/profile.jsx";
import PracticeQues from "../views/User/practiceQues.jsx";
import Leaderboard from "../views/User/leaderboard.jsx";
import Problem from "../views/User/problem.jsx";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/user/home" element={<PracticeQues />} />
      <Route path="/user/contests" element={<Contests />} />
      <Route path="/user/profile" element={<Profile />} />
      <Route path="/user/practice" element={<PracticeQues />} /> 
      <Route path="/user/leaderboard" element={<Leaderboard />} />
      <Route path="/user/problem/:problemId" element={<Problem />} />
      <Route path="/user/*" element={<Navigate to="/user/home" replace />} />
    </Routes>
  );
}

export default UserRoutes;
