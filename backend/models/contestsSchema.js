import mongoose from "mongoose";
const Schema = mongoose.Schema;

// Contest Schema
const ContestSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  problems: [
    {
      type: Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
  ],
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date, 
    required: true,
  },
  registeredUsers: [    
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  leaderBoard: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      score: {
        type: Number,
        default: 0,
      },
      solvedProblems: [
        {
          type: Schema.Types.ObjectId,
          ref: "Problem",
        },
      ],
    },
  ],
});

const Contests = mongoose.model("Contest", ContestSchema);

export default Contests;
