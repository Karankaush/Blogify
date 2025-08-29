import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ success: false, error: "Not authenticated" });
  }

  const userId = session.user.id;
  const blogId = ((await params).id);

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog not found" });
    }

    // agar already liked hai to hata do (toggle like)
    if (blog.likedBy.includes(userId)) {
      blog.likedBy.pull(userId);
      blog.likes = blog.likes - 1;
    } else {
      // agar dislike kiya tha pehle → use hatao
      if (blog.dislikedBy.includes(userId)) {
        blog.dislikedBy.pull(userId);
        blog.dislikes = blog.dislikes - 1;
      }

      // fir like add karo
      blog.likedBy.push(userId);
      blog.likes = blog.likes + 1;
    }

    await blog.save();
    return NextResponse.json({ success: true, message : 'Liked',  blog });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
