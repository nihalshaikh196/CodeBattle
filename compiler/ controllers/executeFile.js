import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname);

const dirCppOutputs = path.join(__dirname, "..", "outputs/cpp");
const dirJavaOutputs = path.join(__dirname, "..", "outputs/java");
const dirPythonOutputs = path.join(__dirname, "..", "outputs/python");
const dirCOutputs = path.join(__dirname, "..", "outputs/c");
if (!fs.existsSync(dirCppOutputs)) {
  fs.mkdirSync(dirCppOutputs, { recursive: true });
}
if (!fs.existsSync(dirCOutputs)) {
  fs.mkdirSync(dirCOutputs, { recursive: true });
}
if (!fs.existsSync(dirJavaOutputs)) {
  fs.mkdirSync(dirJavaOutputs, { recursive: true });
}
if (!fs.existsSync(dirPythonOutputs)) {
  fs.mkdirSync(dirPythonOutputs, { recursive: true });
}

const executeFile = async (filePath, language, inputFilePath) => {
  const jobId = path.basename(filePath).split(".")[0];
  const fileName = `${jobId}.out`;
  const outputPath = path.join(dirCppOutputs, fileName);

  const command =
    inputFilePath.length > 0
      ? `g++ ${filePath} -o ${outputPath} && cd ${dirCppOutputs} && ./${fileName} < ${inputFilePath}`
      : `g++ ${filePath} -o ${outputPath} && cd ${dirCppOutputs} && ./${fileName}`;

  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        const errorLines = stderr.split("\n");
        const errors = errorLines
          .filter((line) => line.includes("error:"))
          .map((line) => {
            const match = line.match(/:(\d+:\d+:)/);
            return match
              ? `error: ${match[1]} ${line.split("error:")[1].trim()}`
              : line;
          });
        const warnings = errorLines
          .filter((line) => line.includes("warning:"))
          .map((line) => {
            const match = line.match(/:(\d+:\d+:)/);
            return match
              ? `warning: ${match[1]} ${line.split("warning:")[1].trim()}`
              : line;
          });

        resolve({
          success: false,
          type: "Compilation Error",
          errors: errors.join("\n"),
          warnings: warnings.join("\n"),
        });
      } else if (stderr) {
        const errorLines = stderr.split("\n");
        const processedErrors = errorLines.map((line) => {
          const match = line.match(/:(\d+:\d+:)/);
          return match
            ? `Runtime error: ${match[1]} ${line
                .split(":")
                .slice(-1)[0]
                .trim()}`
            : line;
        });

        resolve({
          success: false,
          type: "Runtime Error",
          error: processedErrors.join("\n"),
        });
      } else {
        resolve({ success: true, output: stdout });
      }
    });
  });
};

export default executeFile;
