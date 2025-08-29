import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogDetail from "./BlogDetail";

export default async function BlogPage({ params }) {
    try{
        const id = ((await params).id)
        await connectDB();
        const blog = await Blog.findById(id).lean();
      
        if (!blog) {
          return <div>Blog not found</div>;
        }
      
        return <BlogDetail blog={JSON.parse(JSON.stringify(blog))} id={id} />;

    } catch (error) {
        console.error("Failed to load blog:", error);
        return <div>Failed to load blog</div>;
    }
}
