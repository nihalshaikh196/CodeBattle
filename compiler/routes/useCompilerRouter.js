import express from "express";
import generateFile from "../ controllers/generateFile.js";
import executeFile from "../ controllers/executeFile.js";
import generateInputFile from "../ controllers/generateInputFile.js";
const compilerRouter = express.Router();

compilerRouter.post("/run", async (req, res) => {
  const { code, language,input } = req.body;
  if (code === undefined || language === undefined) {
    return res.status(400).json({
      success: false,
      message: "Code and language are required!",
    });
  }
  // console.log(req.body,input.length);
  try {
    const {filePath,codeId }= await generateFile(code, language);
    var inputFilePath="";
    if(input.length>0)  inputFilePath = await generateInputFile(input,codeId);
    
    const result = await executeFile(filePath, language,inputFilePath);
    // console.log(output);
    return res.json({result });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error,
    });
  }
});


compilerRouter.post("/submit", async (req, res) => {
  const { code, language, testCases } = req.body;
  if (
    code === undefined ||
    language === undefined ||
    !Array.isArray(testCases)
  ) {
    return res.status(400).json({
      success: false,
      message: "Code, language, and testCases array are required!",
    });
  }

  try {
    const {filePath,codeId} = await generateFile(code, language);
    const results = [];

    for (const testCase of testCases) {
      const inputFilePath = await generateInputFile(testCase.input, codeId);
      const result = await executeFile(filePath, language, inputFilePath);

      if (!result.success) {
        // If there's an error, stop execution and return the result
        return res.json({
          success: false,
          filePath:filePath,
          error:true,
          message: "Execution error",
          result: {
            input: testCase.input,
            expectedOutput: testCase.output,
            actualOutput: result.output,
            passed: false,
            ...result,
          },
        });
      }

      results.push({
        input: testCase.input,
        expectedOutput: testCase.output,
        actualOutput: result.output,
        passed: result.output.trim() === testCase.output.trim(),
        ...result,
      });

      if(!(result.output.trim() === testCase.output.trim())) break;

    }

    // Calculate overall result
    const allPassed = results.every((result) => result.passed);
    const overallResult = {
      success: allPassed,
      filePath: filePath,
      error:false,
      message: allPassed ? "All test cases passed" : "Some test cases failed",
      results: results,
    };

    return res.status(200).json(overallResult);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
});

export default compilerRouter;
