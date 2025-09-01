// models/Blog.js
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    aiContent: {
      type: String, // AI suggested content (before user edits)
      default: "",
    },
    generatedByAI: {
      type: Boolean,
      default: false, // true => AI generated, false => manual
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    views: {
      type: Number,
      default: 0,
      required: true,
      min: 0,
    },
    likes: {
      type: Number,
      default: 0,
      required: true,
    },
    dislikes: {
      type: Number,
      default: 0,
      required: true,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    category: {
      type: String,
      enum: [
        "Science",
        "Technology",
        "Sport",
        "Health",
        "Travel",
        "Food",
        "Education",
        "Business",
        "Psychology",
        "Politics",
        "Others",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
