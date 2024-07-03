import mongoose from "mongoose";
const Schema = mongoose.Schema;

const contestSubmissionSchema = new Schema({
  contestId: {
    type: Schema.Types.ObjectId,
    ref: "Contest",
    required: true,
  },
  userSubmissions: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      problemsSolved: [
        {
          problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Problem",
            required: true,
          },
          solved:{
            type:Boolean,
            default:false
          },
          submissions: [
            {
              codeFileReference: {
                type: String, // URL or path to the code file
              },
              submissionTime: {
                type: Date,
              },
              testCasesPassed: {
                type: Number,
              },
              status: {
                type: String,
                enum: [
                  "Accepted",
                  "Wrong Answer",
                  "Time Limit Exceeded",
                  "Compilation Error",
                  "Runtime Error",
                  "Memory Limit Exceeded",
                  "Output Limit Exceeded",
                ],
              },
              result: {
                type: mongoose.Schema.Types.Mixed,
              },
            },
          ],
        },
      ],
    },
  ],
});

const ContestSubmission = mongoose.model(
  "ContestSubmission",
  contestSubmissionSchema
);

export default ContestSubmission;
