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
    required: true,   // 👈 add this
    min: 0,
  },
  likes :{
    type : Number,
    default : 0,
    required : true
  },

  disLikes :{
    type : Number,
    default : 0,
    required : true
  },

}, { timestamps: true });

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
