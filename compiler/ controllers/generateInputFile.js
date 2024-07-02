import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname);

const dirInput = path.join(__dirname, "..", "inputs");

if (!fs.existsSync(dirInput)) {
  fs.mkdirSync(dirInput, { recursive: true });
}

const generateInputFile = async (input,codeId) => {
  const inputId = codeId;
  const fileName = `${inputId}.txt`;

  const filePath = path.join(dirInput, fileName);

  fs.writeFileSync(filePath, input, { flag: "w" });

  //   console.log(filePath);
  return filePath;
};

export default generateInputFile;
