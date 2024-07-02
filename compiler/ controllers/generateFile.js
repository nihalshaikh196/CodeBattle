import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname);

const dirCppCodes = path.join(__dirname, "..", "codes/cpp");
const dirJavaCodes = path.join(__dirname, "..", "codes/java");
const dirPythonCodes = path.join(__dirname, "..", "codes/python");
const dirCCodes = path.join(__dirname, "..", "codes/c");
if (!fs.existsSync(dirCppCodes)) {
  fs.mkdirSync(dirCppCodes, { recursive: true });
}
if (!fs.existsSync(dirCCodes)) {
  fs.mkdirSync(dirCCodes, { recursive: true });
}
if (!fs.existsSync(dirJavaCodes)) {
  fs.mkdirSync(dirJavaCodes, { recursive: true });
}
if (!fs.existsSync(dirPythonCodes)) {
  fs.mkdirSync(dirPythonCodes, { recursive: true });
}

const generateFile = async (code, language) => {
  const codeId = uuid();
  const fileName = `${codeId}.${language}`;
  var filePath = "";
  if (language === "cpp") {
    filePath = path.join(dirCppCodes, fileName);
  } else if (language === "java") {
    filePath = path.join(dirJavaCodes, fileName);
  } else if (language === "python") {
    filePath = path.join(dirPythonCodes, fileName);
  } else if (language === "c") {
    filePath = path.join(dirCCodes, fileName);
  }

  fs.writeFileSync(filePath, code);

//   console.log(filePath);
  return {filePath,codeId};
};

export default generateFile;
