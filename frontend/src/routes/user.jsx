
import { Routes, Route } from "react-router-dom";

import Contests from "../views/User/contests.jsx";
import Profile from "../views/User/profile.jsx";
import PracticeQues from "../views/User/practiceQues.jsx";
import Leaderboard from "../views/User/leaderboard.jsx";
import Problem from "../views/User/problem.jsx";

function UserRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<PracticeQues />} />
      <Route path="/contests" element={<Contests />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/practice" element={<PracticeQues />} /> 
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/problem/:problemId" element={<Problem />} />
    </Routes>
  );
}

export default UserRoutes;
