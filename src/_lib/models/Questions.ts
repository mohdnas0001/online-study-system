/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/models/Question.ts
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (arr: string[]) => arr.length >= 4, // 4 options
      message: "At least four options are required",
    },
  },
  correctAnswer: {
    type: String,
    required: true,
    validate: {
      validator: function (this: any, value: string) {
        return this.options.includes(value);
      },
      message: "Correct answer must be one of the provided options",
    },
    },
  course: {
      type: String, 
      required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Question || mongoose.model("Question", questionSchema);