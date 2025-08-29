import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function DELETE(request, { params }) {
  const id = ((await params).id);

  try {
    await connectDB();
    await Blog.findByIdAndDelete(id);
    return new Response(
      JSON.stringify({ success: true, message: "Blog deleted successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: "Error deleting blog" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}