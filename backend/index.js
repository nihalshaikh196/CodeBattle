import express from "express";
const app = express();
import DBConfig from "./database/db.js";
import authRouter from "./routes/authRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import cors from "cors";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
DBConfig();

app.use("/auth", authRouter);
app.use("/admin", adminRouter);


app.get("/", (req, res) => {
  res.send("Server is Running!!!");
});

app.listen(3000, () => {
  console.log("App listening at http://localhost:3000");
});
