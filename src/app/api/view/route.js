import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import Blog from "@/models/Blog";
import { NextResponse } from "next/server";
import { authOptions } from "@/config/auth";


export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  await connectDB();
  const blogs = await Blog.find({ userId: userId }); // filter by current user
  return NextResponse.json({ success: true, blogs });

}


