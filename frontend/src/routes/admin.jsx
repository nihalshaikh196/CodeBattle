import { Routes, Route } from "react-router-dom";

import Home from "../views/Admin/Home";
import UploadProblem from "../views/Admin/UploadProblem";
import Profile from "../views/Admin/Profile";
import Contests from "../views/Admin/Contests";
import Leaderboard from "../views/Admin/LeaderBoard";
import Problems from "../views/Admin/Problems";
import ScheduleContest from "../views/Admin/ScheduleContest";
import ContestDetails from "../views/Admin/ContestDetails";
import EditContest from "../views/Admin/EditContest";
import EditProblem from "../views/Admin/EditProblem";
function AdminRoutes() {
  return (
    <Routes>
      
      <Route path="/home" element={<Home />} />
      <Route path="/uploadProblem" element={<UploadProblem/>} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/contests" element={<Contests />} /> 
      <Route path="/scheduleContest" element={<ScheduleContest />} /> 
      <Route path="/contest/:contestId" element={<ContestDetails />} />
      <Route path="/leaderBoard/:contestId" element={<Leaderboard />} />
      <Route path="/editContest/:contestId/" element={<EditContest />} /> 
      <Route path="/editProblem/:problemId/" element={<EditProblem/>} /> 
      <Route path="/problems" element={<Problems />} />
    </Routes>
  );
}

export default AdminRoutes;
