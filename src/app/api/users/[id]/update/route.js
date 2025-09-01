import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PUT(req, {params}) {

  try{

    const id  = ((await params).id);
  const {name, email, password} = await req.json();

  if(!name){
    return  NextResponse.json({success : false, message : "name required"})
  }

  if(!email){
    return  NextResponse.json({success : false, message : "email required"})
  }
  if(!password){
    return  NextResponse.json({success : false, message : "password required"})
  }

  



  await connectDB();
 
   const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.findByIdAndUpdate(id, {
    name ,
    email ,
    password : hashedPassword
  }, {new: true});


  if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
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

  } catch(err){
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });

  }
  


}





