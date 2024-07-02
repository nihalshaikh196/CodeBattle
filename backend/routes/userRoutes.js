import express from "express";
import User from "../models/userSchema.js";
import authenticateToken from "../middlewares/authenticateToken.js";
const userRouter = express.Router();


userRouter.get("/profile", authenticateToken, async (req, res) => {
  try {
    // console.log("User:",req.user);
    const user = await User.findById(req.user.userId).select('-password -refreshToken'); // Assuming authentication provides user ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    // const profile = {
    //   firstName: user.firstName,
    //   lastName: user.lastName,
    //   email: user.email, 
    // };

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

userRouter.patch("/profile", authenticateToken, async (req, res) => {
  const updates = Object.keys(req.body); // Extract properties to update
  const allowedUpdates = ["firstName", "lastName", "email"]; // Allowed fields for update
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).json({ message: "Invalid update fields" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ message: err.message });
    }
    res.status(500).json({ message: "Server error" });
  }
});


//Delete user account ((Will modify this later))
userRouter.delete("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Handle any necessary cleanup tasks (e.g., removing user data from contests, submissions)

    // Consider logging out the user after deletion (if applicable)
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default userRouter;
