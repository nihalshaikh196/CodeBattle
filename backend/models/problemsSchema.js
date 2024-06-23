import mongoose from "mongoose";

const Schema = mongoose.Schema;

const testCaseSchema = new Schema(
  {
    input: {
      type: Schema.Types.Mixed,
      required: true,
    },
    output: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

const ProblemSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true,
  },
  testCases: [testCaseSchema],

  tags: [String],

  constraints:{
    timeLimit:{
        type:String,
        default:"1000ms"
    },
    memoryLimit:{
        type:String,
        default:"256MB"
    }
  }
});

const Problem = mongoose.model("Problem", ProblemSchema);

export default Problem;
