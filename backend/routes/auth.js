import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";
import dotenv from "dotenv";
const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    //get all data from the request body
    const { firstName, lastName, email, password } = req.body;
    console.log(req.body);
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

    //JWT token for authorization
    const token = jwt.sign(
      { id: userInfo._id, email, userType: "user" },
      process.env.JWT_SECRET,{
        expiresIn: "1d"
      }
    );

    // userInfo.token = token;
    userInfo.password = undefined;

    res.status(201).json({
      message: "Registration successful!!!",
      userInfo: userInfo,
      token: token,
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
   const token = jwt.sign(
     { id: user._id, email, userType: "user" },
     process.env.JWT_SECRET,
     {
       expiresIn: "1d",
     }
   );

   // user.token = token;
   user.password = undefined;

   res.status(200).json({
     message: "Login successful!!!",
     user: user,
     token: token,
   });
});

export default authRouter;
