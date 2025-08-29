import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { title, content } = await req.json();
    const updatedBlog = await Blog.findByIdAndUpdate(
      params.id,
      { title, content },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ message: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Blog updated successfully",
      success: true,
      blog: updatedBlog,
    });
  } catch (err) {
    return NextResponse.json(
      { message: "Error updating blog", error: err.message },
      { status: 500 }
    );
  }
}
