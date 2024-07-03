import ContestSubmission from "../models/contestSubmissionsSchema.js";
import Contest from "../models/contestsSchema.js";


async function updateLeaderBoard(contestId) {
  try {
    // Find all submissions for the given contest and populate necessary fields
    const submissions = await ContestSubmission.find({ contestId })
      .populate({
        path: "userSubmissions.user",
      })
      .populate({
        path: "userSubmissions.problemsSolved.problemId",
      })
      .populate({
        path: "userSubmissions.problemsSolved.submissions",
      });

    const leaderboard = {};

    // Iterate over each submission
    submissions.forEach((submission) => {
      submission.userSubmissions.forEach((userSubmission) => {
        const userId = userSubmission.user._id.toString();
        if (!leaderboard[userId]) {
          leaderboard[userId] = {
            userId,
            score: 0,
            solvedProblems: new Set(),
          };
        }
        userSubmission.problemsSolved.forEach((problemSolved) => {
          const problemId = problemSolved.problemId._id.toString();
          const isProblemSolved = problemSolved.submissions.some(
            (submission) => submission.status === "Accepted"
          );

          if (
            isProblemSolved &&
            !leaderboard[userId].solvedProblems.has(problemId)
          ) {
            leaderboard[userId].solvedProblems.add(problemId);
            leaderboard[userId].score += 5;
          }
        });
      });
    });

    // Convert leaderboard object to array format
    const leaderboardArray = Object.values(leaderboard)
      .map((entry) => ({
        userId: entry.userId,
        score: entry.score,
        solvedProblems: Array.from(entry.solvedProblems),
      }))
      .sort((a, b) => b.score - a.score);;

    // Update the contest document with the new leaderboard
    await Contest.findByIdAndUpdate(contestId, {
      leaderBoard: leaderboardArray,
    });

    return leaderboardArray;
  } catch (err) {
    console.error(err);
  }
}

export default updateLeaderBoard;
