import express from "express";
const app = express();
import useCompilerRouter from "./routes/useCompilerRouter.js";
import cors from "cors";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/compiler", useCompilerRouter);
app.get("/", (req, res) => {
  res.send("Compiler is Running!!!");
});

app.listen(8000, () => {
  console.log("App listening at http://localhost:8000");
});
