import Blog from "@/models/Blog";
import { connectDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";



export async function GET(req) {
    console.log('heheheh');
    
    try {
       const url = new URL(req.url);
    const category = url.searchParams.get("category");
    await connectDB();
    let blogs;

    if (category) {
      blogs = await Blog.find({ category });
    } else {
      blogs = await Blog.find();
    }

    if (!blogs || blogs.length === 0) {
      return NextResponse.json({
        success: false,
        message: "No blog found with related category",
      });
    }

    return NextResponse.json(
      { success: true, message: "Blogs found", blogs },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
