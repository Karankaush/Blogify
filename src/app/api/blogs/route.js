import { NextResponse } from "next/server";
import{ connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";

export async function POST(req){
    try{
        const session = await getServerSession(authOptions);
        if(!session){
            return NextResponse.json({message : "Please login to create a blog"}, {status: 401});
        }

        const {title, content, category, generatedByAI} = await req.json();

        if(!title){
             return NextResponse.json({ success: false, message: "Title is required" },{ status: 400 }
      );
        }
         if (!content) {
      return NextResponse.json( { success: false, message: "Content are required " },{ status: 400 }
      );
    }

         if (!category) {
      return NextResponse.json( { success: false, message: "Category is required " },{ status: 400 }
      );
    }


        await connectDB();

        const newBlog = new Blog({
            title,
            content,
            generatedByAI: Boolean(generatedByAI),
            views : 0,
            like : 0,
            disLike : 0,
            userId: session.user.id,
            category
        })
         await newBlog.save();
        return NextResponse.json({message: "Blog created successfully", success: true}, {status: 201});
    }
   catch (err) {
  console.error("BLOG ERROR:", err);
  return NextResponse.json(
    { message: "Error creating blog", error: err.message, success: false },
    { status: 500 }
  );
}

}