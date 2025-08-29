// /app/api/views/[id]/route.js
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await connectDB();
  const id = ((await params).id);
    console.log(id)
    try {
       const blog = await Blog.findByIdAndUpdate(
  id,
  { $inc: { disLikes: 1 } },
  { new: true }
);
        

        await blog.save();
    return NextResponse.json({ success: true, blog });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
