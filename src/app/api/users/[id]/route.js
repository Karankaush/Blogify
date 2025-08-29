import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";


export async function GET(req, {params}) {
  const id  = ((await params).id);

  await connectDB();

  const user = await User.findById(id);

  if(!user){
    return new Response("User not found", {status: 404});
  }

  return new Response(JSON.stringify(user), {status: 200});




  

}





