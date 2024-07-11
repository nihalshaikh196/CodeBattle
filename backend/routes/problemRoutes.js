import express from "express";
import Problem from "../models/problemsSchema.js";
import authenticateToken from "../middlewares/authenticateToken.js";
import { isAdmin } from "../middlewares/authenticateUserType.js";
import Submission from "../models/submissionSchema.js";


const problemRoutes = express.Router();


const validateProblemData = (data) => {


  const { title, description, difficulty, testCases, tags, constraints } = data;

  if (!title || typeof title !== "string")
    return "Title is required and should be a string.";
  if (!description || typeof description !== "string")
    return "Description is required and should be a string.";
  if (!difficulty || !["Easy", "Medium", "Hard"].includes(difficulty))
    return 'Difficulty must be "Easy", "Medium", or "Hard".';
  if (!Array.isArray(testCases) || testCases.length === 0)
    return "TestCases must be a non-empty array.";
  for (const testCase of testCases) {
    if (!testCase.input) return "Each testCase must have an input.";
    if (testCase.output === undefined)
      return "Each testCase must have an output.";
  }
  if (tags && !Array.isArray(tags)) return "Tags should be an array.";
  if (constraints) {
    if (constraints.timeLimit && typeof constraints.timeLimit !== "string")
      return "TimeLimit should be a string.";
    if (constraints.memoryLimit && typeof constraints.memoryLimit !== "string")
      return "MemoryLimit should be a string.";
  }
  return null;
};

problemRoutes.post("/uploadProblem",authenticateToken,isAdmin, async (req, res) => {
  const { title, description, difficulty, testCases, tags, constraints } =
    req.body;

    
  //check all fields are filled
const validationError = validateProblemData(req.body);

  if (validationError) {
    return res.status(400).json({
      message: "Please fill all the required fields.",
      error: validationError,
    });
  }
  // Create a new Problem document
  const problem = new Problem({
    title,
    description,
    difficulty,
    testCases,
    tags,
    constraints,
  });

  try {
    // Save the document to MongoDB
    const savedProblem = await problem.save();
    res.status(201).json({
      message: "Problem uploaded successfully",
      problem: savedProblem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error uploading problem",
      error: error.message,
    });
  }
});

//update problem

problemRoutes.put(
  "/updateProblem/:id",
  authenticateToken,
  isAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { title, description, difficulty, testCases, tags, constraints } =
      req.body;

    // Validate the updated data
    const validationError = validateProblemData(req.body);


    if (validationError) {
      return res.status(400).json({
        message: "Invalid update data",
        error: validationError,
      });
    }

    try {
      const updatedProblem = await Problem.findByIdAndUpdate(
        id,
        { title, description, difficulty, testCases, tags, constraints },
        { new: true, runValidators: true }
      );

      if (!updatedProblem) {
        return res.status(404).json({ message: "Problem not found" });
      }

      res.status(200).json({
        success: true,
        message: "Problem updated successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error updating problem",
        error: error.message,
      });
    }
  }
);



problemRoutes.get("/getAll", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;
    const problems = await Problem.find().select("-testCases -constraints -description");
    if (!problems) {
      return res.status(404).json({ message: "No problems found" });
    }

    // Fetch user's submission data
    const userSubmission = await Submission.findOne({ user: userId });

    // Create a Set of solved problem IDs for quick lookup
    const solvedProblemIds = new Set();
    if (userSubmission) {
      userSubmission.problemsSolved.forEach((problem) => {
        if (problem.solved) {
          solvedProblemIds.add(problem.problemId.toString());
        }
      });
    }

    // Add isSolved property to each problem
    const problemsWithSolvedStatus = problems.map((problem) => ({
      ...problem.toObject(),
      isSolved: solvedProblemIds.has(problem._id.toString()),
    }));

    res.status(200).json(problemsWithSolvedStatus);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching problems", error: error.message });
  }
});
problemRoutes.get("/:id",authenticateToken, async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.json(problem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default problemRoutes;
