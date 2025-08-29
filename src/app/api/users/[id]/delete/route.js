import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";


export async function DELETE(req, {params}){
    const id  = ((await params).id);
    await connectDB();

    const user = await User.findByIdAndDelete(id);

    if(!user){
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }
    return NextResponse.json({
        success: true,
        message: "User deleted successfully",
       
      });
}