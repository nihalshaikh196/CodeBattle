import express from "express";
const compilerRouter = express.Router();
import authenticateToken from "../middlewares/authenticateToken.js";
import Problem from "../models/problemsSchema.js"
import Submission from "../models/submissionSchema.js";
import ContestSubmission from "../models/contestSubmissionsSchema.js";

const COMPILER_URL = process.env.OJ_COMPILER_URL;

compilerRouter.post("/run", authenticateToken, async (req, res) => {
  const { code, language, input } = req.body;
  // if(input === undefined) 
  try {
    const response = await fetch(`${COMPILER_URL}/compiler/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, input }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    // console.log(data);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in compiler route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


compilerRouter.post("/submitContest", authenticateToken, async (req, res) => {
  const { code, language, problemId, contestId } = req.body;
  const { userId } = req.user;

  try {
    // Find the problem by its ID
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    // Submit the code to the compiler service
    const response = await fetch(`${COMPILER_URL}/compiler/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, testCases: problem.testCases }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const compilerResult = await response.json();

    // Find the contest submission document
    let contestSubmission = await ContestSubmission.findOne({ contestId });

    if (!contestSubmission) {
      // If no submissions for this contest yet, create a new document
      contestSubmission = new ContestSubmission({
        contestId,
        userSubmissions: [],
      });
    }

    // Find the user's submission within the contest
    let userSubmission = contestSubmission.userSubmissions.find(
      (sub) => sub.user.toString() === userId
    );

    // console.log(userSubmission);

    if (!userSubmission) {
      // If user hasn't made any submissions in this contest, add them
      userSubmission = { user: userId, problemsSolved: [] };
      
    }

    // Check if the user has already solved this problem in the contest
    const problemIndex = userSubmission.problemsSolved.findIndex(
      (p) => p.problemId.toString() === problemId
    );

    const newSubmission = {
      codeFileReference: compilerResult.filePath,
      submissionTime: new Date(),
      testCasesPassed: !compilerResult.error
        ? compilerResult.results.filter((r) => r.passed).length
        : 0,
      status: compilerResult.success
        ? "Accepted"
        : compilerResult.error
        ? "Compilation Error"
        : "Wrong Answer",
      result: compilerResult,
    };

    // console.log(contestSubmission);

    if (problemIndex > -1) {
      // User has solved this problem before, add to existing submissions
      userSubmission.problemsSolved[problemIndex].submissions.push(
        newSubmission
      );
      if(compilerResult.success)userSubmission.problemsSolved[problemIndex].solved = true;
    } else {
      // User hasn't solved this problem before, add new problem entry
      userSubmission.problemsSolved.push({
        problemId: problemId,
        solved:compilerResult.success,
        submissions: [newSubmission],
      });
      contestSubmission.userSubmissions.push(userSubmission);
    }

    // Mark the nested fields as modified
    contestSubmission.markModified("userSubmissions");
    contestSubmission.markModified("userSubmissions.problemsSolved");

    // Save the updated contest submission document
    await contestSubmission.save();

    // Send the compiler result back to the client
    res.status(200).json(compilerResult);
  } catch (error) {
    console.error("Error in compiler route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


compilerRouter.post("/submitPractice", authenticateToken, async (req, res) => {
  const { code, language, problemId } = req.body;
  const { userId } = req.user;

  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        message: "Problem not found",
      });
    }

    const response = await fetch(`${COMPILER_URL}/compiler/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, testCases: problem.testCases }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const compilerResult = await response.json();
    // console.log(compilerResult);

    // Find the user's submission document
    let submission = await Submission.findOne({ user: userId });

    if (!submission) {
      // If user hasn't made any submissions yet, create a new document
      submission = new Submission({ user: userId, problemsSolved: [] });
    }

    // Check if the user has already solved this problem
    const problemIndex = submission.problemsSolved.findIndex(
      (p) => p.problemId.toString() === problemId
    );

    if (problemIndex > -1) {
      // User has solved this problem before, add to existing submissions
      submission.problemsSolved[problemIndex].submissions.push({
        codeFileReference: compilerResult.filePath,
        submissionTime: new Date(),
        testCasesPassed: !compilerResult.error? compilerResult.results.filter((r) => r.passed).length:0,
        status: compilerResult.success ? "Accepted" :compilerResult.error?"Compilation Error":"Wrong Answer",
        result: compilerResult,
      });
      if(compilerResult.success){ submission.problemsSolved[problemIndex].solved = true; }
    } else {
      // User hasn't solved this problem before, add new problem entry
      submission.problemsSolved.push({
        problemId: problemId,
        solved: compilerResult.success,
        submissions: [
          {
            codeFileReference: compilerResult.filePath,
            submissionTime: new Date(),
            testCasesPassed: !compilerResult.error
              ? compilerResult.results.filter((r) => r.passed).length
              : 0,
            status: compilerResult.success
              ? "Accepted"
              : compilerResult.error
              ? "Compilation Error"
              : "Wrong Answer",
            result: compilerResult,
          },
        ],
      });
    }

    // Save the updated submission document
    await submission.save();
    // console.log(compilerResult);
    res.status(200).json(
      compilerResult
    );
  } catch (error) {
    console.error("Error in compiler route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default compilerRouter;