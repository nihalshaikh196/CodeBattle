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
  console.log(req.body,input.length);
  try {
    const filePath = await generateFile(code, language);
    var inputFilePath="";
    if(input.length>0)  inputFilePath = await generateInputFile(input);
    
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

export default compilerRouter;
