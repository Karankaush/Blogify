import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PUT(req, {params}) {
  const id  = ((await params).id);
  const body = await req.json();
  await connectDB();
  const password = body.password
   const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findByIdAndUpdate(id, {
    name : body.name,
    email : body.email,
    password : hashedPassword
  }, {new: true});


  if(!user){
    return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
  }
  return NextResponse.json({
      success: true,
      message : "User update Successfully",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      }
    });


}





