import Contest from "../models/contestsSchema"; 

const checkContestRegistration = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming contestId is passed as a route parameter
    const userId = req.user._id; // Assuming you have user info in req.user after authentication

    // Find the contest
    const contest = await Contest.findById(id);

    if (!contest) {
      return res.status(404).json({ message: "Contest not found" });
    }

    // Check if the user is registered for the contest
    const isRegistered = contest.registeredUsers.some(
      (registeredUserId) => registeredUserId.toString() === userId.toString()
    );

    if (!isRegistered) {
      return res
        .status(403)
        .json({ message: "User is not registered for this contest" });
    }

    // If registered, attach the contest to the request object for potential future use
    req.contest = contest;

    // User is registered, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error("Error checking contest registration:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export default checkContestRegistration;
