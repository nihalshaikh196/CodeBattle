
import { Routes, Route } from "react-router-dom";

import Contests from "../views/User/contests.jsx";
import Profile from "../views/User/profile.jsx";
import PracticeQues from "../views/User/practiceQues.jsx";
import Leaderboard from "../views/User/leaderboard.jsx";
import Problem from "../views/User/problem.jsx";
import ContestDetails from "../views/User/contestDetail.jsx";
import ContestAttempt from "../views/User/contestAttempt.jsx";
import ContestProblem from "../views/User/contestProblem.jsx";
function UserRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<PracticeQues />} />
      <Route path="/contests" element={<Contests />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/practice" element={<PracticeQues />} /> 
      <Route path="/leaderboard/:contestId" element={<Leaderboard />} />
      <Route path="/problem/practice/:problemId" element={<Problem />} />
      <Route path="/problem/contest/:contestId/:problemId" element={<ContestProblem />} />
      <Route path="/contest/:contestId" element={<ContestDetails />} />
      <Route path="/contestAttempt/:contestId" element={<ContestAttempt/>} />
    </Routes>
  );
}

export default UserRoutes;
