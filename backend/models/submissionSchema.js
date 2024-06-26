import mongoose from "mongoose";
const Schema = mongoose.Schema;

const submissionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemsSolved: [
    {
      problemId: {
        // Reference to the Problem schema
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
        required: true,
      },
      submissions:[{
        codeFileReference: {
            type: String, // URL or path to the code file
          },
          attempts: [
            {
              submissionTime: {
                type: Date,
              },
              testCasesPassed: {
                type: Number,
              },
              status:{
                type: String,
                enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Compilation Error", "Runtime Error", "Memory Limit Exceeded", "Output Limit Exceeded"]
              }
            },
          ],
      }]
      
    },
  ],
});

const Submission = mongoose.model("Submission", submissionSchema);

module.exports = Submission;
