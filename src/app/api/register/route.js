import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from 'bcrypt';

export async function POST(req){
    try{
        const {name, email, password} = await req.json();
        await connectDB();

       const isAlreadyUser = await User.findOne({ email });
    if (isAlreadyUser) {
       return Response.json({success : false, message: "User Already Registered "});
    }
        const hashedPassword = await bcrypt.hash(password, 10);


        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();
        
        return Response.json({success : true, message: "User registered successfully"}, {status: 201});
    }
    catch(err){
        return new Response(JSON.stringify({error: "Invalid request"}), {status: 400});
    }
}