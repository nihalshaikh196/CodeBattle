import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import dotenv from "dotenv";
import authenticateToken from "../middlewares/authenticateToken.js";
import {isAdmin, isUser} from "../middlewares/authenticateUserType.js";

const authRouter = express.Router();

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;

function generateTokens(user) {
  const accessToken = jwt.sign(
    { userId: user._id, userType: user.userType },
    JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );
  const refreshToken = jwt.sign({ userId: user._id }, JWT_REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
  return { accessToken, refreshToken };
}

authRouter.post("/register", async (req, res) => {
  try {
    //get all data from the request body
    const { firstName, lastName, email, password } = req.body;
    //check all fields are filled
    if (!(firstName && lastName && email && password)) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    //check if the email already exists in the database
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }
    //encrypt the password(used sync version but can try async version as well)
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(password, salt);
    //create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      registrationTime: Date.now()
    });
    //save the user to the database
    const userInfo = await newUser.save();

    // userInfo.token = token;
    userInfo.password = undefined;

    res.status(201).json({
      message: "Registration successful!!!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Registration not done! Something went wrong",
    });
  }
});

authRouter.post("/login", async (req, res) => {
  //get all data from the request body
  const { email, password } = req.body;

  //check all fields are filled
  if (!(email && password)) {
    return res.status(400).json({
      message: "Email and password are required!",
    });
  }
  //check if the email already exists in the database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({
      message: "User with this email does not exist",
    });
  }
  //check if the password is correct
  const isPasswordCorrect = await bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    return res.status(400).json({
      message: "Incorrect password",
    });
  }

  //JWT token for authorization
  const { accessToken, refreshToken } = generateTokens(user);
  user.refreshToken = refreshToken;

  // user.token = token;
  user.password = undefined;

  res.status(200).json({
    message: "Login successful!!!",
    userInfo: user,
    accessToken,
    refreshToken
  });
});

// Refresh token route
authRouter.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.sendStatus(401);

  try {
    const user = await User.findOne({ refreshToken });
    if (!user) return res.sendStatus(403);

    jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
      user.refreshToken = newRefreshToken;
      user.save();
      res.json({ accessToken, refreshToken: newRefreshToken });
    });
  } catch (error) {
    res.sendStatus(500);
  }
});

// Logout route
authRouter.post('/logout', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.refreshToken = null;
    await user.save();
    res.sendStatus(204);
  } catch (error) {
    res.sendStatus(500);
  }
});


// Protected route for all authenticated users
authRouter.get("/protected", authenticateToken, (req, res) => {
  res.json({
    message: "This is a protected route for all authenticated users",
    userId: req.user.userId,
    userType: req.user.userType,
  });
});

// Protected route only for admins
authRouter.get("/admin", authenticateToken, isAdmin, (req, res) => {
  res.json({
    message: "This is a protected route only for admins",
    userId: req.user.userId,
    userType: req.user.userType,
  });
});
authRouter.get("/user", authenticateToken, isUser, (req, res) => {
  res.json({
    message: "This is a protected route only for users",
    userId: req.user.userId,
    userType: req.user.userType,
  });
});
export default authRouter;
