// models/Blog.js
import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
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
     required: true
       },

  dislikes: { 
    type: Number, 
    default: 0, 
    required: true 
  },   
  likedBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],
  dislikedBy: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" 
  }],

}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
