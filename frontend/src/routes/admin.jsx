import { Routes, Route } from "react-router-dom";

import Home from "../views/Admin/Home";
import UploadProblem from "../views/Admin/UploadProblem";
import Profile from "../views/Admin/Profile";
import Contests from "../views/Admin/Contests";
import Leaderboard from "../views/Admin/LeaderBoard";
import Problems from "../views/Admin/Problems";

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/home" element={<Home />} />
      <Route path="/uploadProblem" element={<UploadProblem/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contests" element={<Contests />} /> 
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/problems" element={<Problems />} />
    </Routes>
  );
}

export default AdminRoutes;
