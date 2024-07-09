import express from "express";
import Contest from "../models/contestsSchema.js";
import Joi from "joi";
import authenticateToken from "../middlewares/authenticateToken.js";
import { isAdmin, isUser } from "../middlewares/authenticateUserType.js";
import mongoose from "mongoose";
import updateLeaderBoard from "../controllers/leaderBoard.js";
import ContestSubmission from "../models/contestSubmissionsSchema.js";

const contestRoutes = express.Router();

const contestValidationSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  problems: Joi.array()
    .items(Joi.string().length(24).hex().required())
    .required(),
  startTime: Joi.date().iso().required(),
  endTime: Joi.date().iso().min(Joi.ref("startTime")).required(),
});

const validateContest = (data) => {
  return contestValidationSchema.validate(data);
};

contestRoutes.post("/createContest",authenticateToken,isAdmin, async (req, res) => {
  const { error } = validateContest(req.body);
// console.log(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { title, description, problems, startTime, endTime } = req.body;

  try {
    const contest = new Contest({
      title,
      description,
      problems,
      startTime,
      endTime,
    });

    await contest.save();
    res.status(201).json({ message: "Contest created successfully", contest });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Register in contest

contestRoutes.post(
  "/register/:id",
  authenticateToken,
  isUser,
  async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;

    try {
      const contest = await Contest.findById(id);
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      if (new Date() > contest.endTime) {
        return res
          .status(400)
          .json({ message: "Cannot register for a past contest" });
      }

      if (contest.registeredUsers.includes(userId)) {
        return res
          .status(400)
          .json({ message: "User already registered for the contest" });
      }

      contest.registeredUsers.push(userId);
      await contest.save();
      return res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//Get contest by id

contestRoutes.get("/getContest/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;

  try {
    const contest = await Contest.findById(id)
      .populate("problems").select("-registeredUsers -leaderBoard");
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }
    res.status(200).json(contest);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//Future Contests Route
contestRoutes.get("/futureContests", authenticateToken, async (req, res) => {
  try {
    const currentTime = new Date();
    const futureContests = await Contest.find({
      startTime: { $gt: currentTime },
    }).select(" title startTime endTime description");
    res.status(200).json(futureContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ongoing Contests Route
contestRoutes.get("/ongoingContests", authenticateToken, async (req, res) => {
  try {
    const currentTime = new Date();
    const ongoingContests = await Contest.find({
      startTime: { $lte: currentTime },
      endTime: { $gt: currentTime },
    }).select(" title startTime endTime description");
    res.status(200).json(ongoingContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Past Contests Route
contestRoutes.get("/pastContests", authenticateToken, async (req, res) => {
  try {
    const currentTime = new Date();
    const pastContests = await Contest.find({
      endTime: { $lte: currentTime },
    }).select(" title startTime endTime description");
    res.status(200).json(pastContests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Modify Contest Route
contestRoutes.put(
  "/modifyContest/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {

     const { error } = validateContest(req.body);
     // console.log(req.body);
     if (error) {
       return res.status(400).json({ error: error.details[0].message });
     }
    const { id } = req.params;
    const { title, description, problems, startTime, endTime } = req.body;

    try {
      const contest = await Contest.findById(id);
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      // Update the contest fields if they are provided in the request body
      if (title) contest.title = title;
      if (description) contest.description = description;
      if (problems) contest.problems = problems;
      if (startTime) contest.startTime = startTime;
      if (endTime) contest.endTime = endTime;

      await contest.save();
      res
        .status(200)
        .json({ message: "Contest updated successfully", contest });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Delete Contest Route
contestRoutes.delete(
  "/deleteContest/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid contest ID format" });
    }
    try {
      const contest = await Contest.findById(id);
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      await contest.remove();
      res.status(200).json({ message: "Contest deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//check if user is registered
contestRoutes.get(
  "/checkIfRegistered/:id",
  authenticateToken,
  async (req, res) => {
    const { id } = req.params;
    const { userId } = req.user;
    // console.log(id,userId);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid contest ID format" });
    }
    try {
      const users = await Contest.findById(id).select(" registeredUsers");

      if (!users.registeredUsers.includes(userId)) {
        return res
          .status(200)
          .json({ success: false, message: "User not registered!" });
      } else {
        res.status(200).json({ success: true, message: "User registered!" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message, hehh: "fskfmksdm" });
    }
  }
);

//GetLeaderBoard

contestRoutes.get("/getLeaderBoard/:id",  async (req, res) => {
  const { id } = req.params;

  try {
    const contest = await Contest.findById(id).populate({
      path: "leaderBoard.userId",
      select: "firstName lastName rank",
    });
    // console.log(contest);
    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    const leaderBoard = contest.leaderBoard.sort((a, b) => b.score - a.score);

    const simplifiedLeaderBoard = leaderBoard.map((entry) => ({
      user: entry.userId,
      username: entry.userId.username,
      score: entry.score,
      solvedProblems: entry.solvedProblems.length,
    }));

    res.status(200).json(simplifiedLeaderBoard);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

contestRoutes.post("/updateLeaderBoard/:id",authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

   await updateLeaderBoard(id);

    res.status(200).json({ success:true, message: "LeaderBoard Updated" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

contestRoutes.get(
  "/userSolvedProblems/:contestId",
  authenticateToken,
  async (req, res) => {
    const { contestId } = req.params;
    const { userId } = req.user;

    if (!mongoose.Types.ObjectId.isValid(contestId)) {
      return res.status(400).json({ message: "Invalid contest ID format" });
    }

    try {
      // Find the contest
      const contest = await Contest.findById(contestId);
      if (!contest) {
        return res.status(404).json({ message: "Contest not found" });
      }

      // Find the user's submissions for this contest
      const contestSubmission = await ContestSubmission.findOne({ contestId });

      if (!contestSubmission) {
        return res.status(200).json({
          contestId: contestId,
          solvedProblems: {},
        });
      }

      const userSubmission = contestSubmission.userSubmissions.find(
        (sub) => sub.user.toString() === userId
      );

      if (!userSubmission) {
        return res.status(200).json({
          contestId: contestId,
          solvedProblems: {},
        });
      }

      // Create an object with solved status for each problem
      const solvedStatus = userSubmission.problemsSolved.reduce(
        (acc, problem) => {
          acc[problem.problemId.toString()] = problem.solved;
          return acc;
        },
        {}
      );

      // Get the list of all problem IDs in the contest
      const allProblemsInContest = contest.problems.map((problem) =>
        problem.toString()
      );

      // Ensure all contest problems are included in the response
      const finalSolvedStatus = allProblemsInContest.reduce(
        (acc, problemId) => {
          acc[problemId] = solvedStatus[problemId] || false;
          return acc;
        },
        {}
      );

      res.status(200).json({
        contestId: contestId,
        solvedProblems: finalSolvedStatus,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default contestRoutes;
