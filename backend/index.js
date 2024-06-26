import express from "express";
const app = express();
import DBConfig from "./database/db.js";
import authRouter from "./routes/authRoutes.js";
import problemRouter from "./routes/problemRoutes.js";
import contestRouter from "./routes/contestRoutes.js";
import cors from "cors";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
DBConfig();

app.use("/auth", authRouter);
app.use("/problem", problemRouter);
app.use("/contest", contestRouter);

app.get("/", (req, res) => {
  res.send("Server is Running!!!");
});

app.listen(3000, () => {
  console.log("App listening at http://localhost:3000");
});
