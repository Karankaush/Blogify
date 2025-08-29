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

    // agar already disliked hai to hata do (toggle dislike)
    if (blog.dislikedBy.includes(userId)) {
      blog.dislikedBy.pull(userId);
      blog.dislikes = blog.dislikes - 1;
    } else {
      // agar pehle like tha to use hatao
      if (blog.likedBy.includes(userId)) {
        blog.likedBy.pull(userId);
        blog.likes = blog.likes - 1;
      }

      // fir dislike add karo
      blog.dislikedBy.push(userId);
      blog.dislikes = blog.dislikes + 1;
    }

    await blog.save();
    return NextResponse.json({ success: true, message : 'disliked', blog });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
