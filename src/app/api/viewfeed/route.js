import { NextResponse } from "next/server";
import Blog from "@/models/Blog";
import { connectDB } from "@/lib/mongodb";

export async function GET(){
    try{
        await connectDB();
        const allBlogs = await Blog.find();
        console.log('req is comming')
        return NextResponse.json({message: "All blogs fetch successfully", success : true, allBlogs},  {status : 201})
    } catch(err){
         return NextResponse.json({ success: false, error: err.message });
    }
}