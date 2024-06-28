import express from "express";
const compilerRouter = express.Router();
import authenticateToken from "../middlewares/authenticateToken.js";

compilerRouter.post("/run", authenticateToken, async (req, res) => {
  const { code, language, input = "" } = req.body;

  try {
    const response = await fetch("http://localhost:8000/compiler/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language, input }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in compiler route:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default compilerRouter;