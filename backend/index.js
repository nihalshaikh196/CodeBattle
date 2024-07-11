import express from "express";
const app = express();
import DBConfig from "./database/db.js";
import authRouter from "./routes/authRoutes.js";
import problemRouter from "./routes/problemRoutes.js";
import contestRouter from "./routes/contestRoutes.js";
import userRouter from "./routes/userRoutes.js";
import useCompilerRouter from "./routes/useCompilerRouter.js";
import cors from "cors";

const corsOptions = {
  origin: "http://localhost:5173", // replace with your frontend URL
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
DBConfig();

app.use("/auth", authRouter);
app.use("/problem", problemRouter);
app.use("/contest", contestRouter);
app.use("/user", userRouter);
app.use("/compiler",useCompilerRouter)
app.get("/", (req, res) => {
  res.send("Server is Running!!!");
});

app.listen(3000, () => {
  console.log("App listening at http://localhost:3000");
});
