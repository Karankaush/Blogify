import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";


export async function GET(){
    try{
        await connectDB();

        const users = await User.find({});
        return Response.json(users);
    } catch (error) {
        return Response.json({ error: "Failed to fetch all users" }, { status: 500 });
    }
}